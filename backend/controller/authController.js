import uploadOnCloudinary from "../config/cloudinary.js"
import User from "../model/userModel.js"
import validator from "validator"
import bcrypt from "bcryptjs"
import genToken from "../config/token.js"
import sendMail from "../config/sendEmail.js"

const isProd = process.env.NODE_ENV === "production"

const cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000
}

// ================= SIGN UP =================
export const signUp = async (req, res) => {

    try {

        const { userName, email, password } = req.body

        let photoUrl

        // Upload image on cloudinary
        if (req.file) {
            photoUrl = await uploadOnCloudinary(req.file.path)
        }

        // Check existing user
        const existUser = await User.findOne({ email })

        if (existUser) {
            return res.status(400).json({
                message: "User already exists"
            })
        }

        // Validate email
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                message: "Invalid Email"
            })
        }

        // Validate password
        if (password.length < 8) {
            return res.status(400).json({
                message: "Enter Strong Password"
            })
        }

        // Hash password
        const hashPassword = await bcrypt.hash(password, 10)

        // Create user
        const user = await User.create({
            userName,
            email,
            password: hashPassword,
            photoUrl
        })

        // Generate token
        const token = genToken(user._id)

        // Save cookie
        res.cookie("token", token, cookieOptions)

        return res.status(201).json(user)

    } catch (error) {

        return res.status(500).json({
            message: `SignUp error ${error}`
        })

    }
}

// ================= SIGN IN =================
export const signIn = async (req, res) => {

    try {

        const { email, password } = req.body

        // Find user
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            })
        }

        // Compare password
        const matchPassword = await bcrypt.compare(
            password,
            user.password
        )

        if (!matchPassword) {
            return res.status(400).json({
                message: "Incorrect Password"
            })
        }

        // Generate token
        const token = genToken(user._id)

        // Save cookie
        res.cookie("token", token, cookieOptions)

        return res.status(200).json(user)

    } catch (error) {

        return res.status(500).json({
            message: `SignIn error ${error}`
        })

    }
}

// ================= SIGN OUT =================
export const signOut = async (req, res) => {

    try {

        res.clearCookie("token", {
            path: "/",
            sameSite: isProd ? "none" : "lax",
            secure: isProd
        })

        return res.status(200).json({
            message: "SignOut Successfully"
        })

    } catch (error) {

        return res.status(500).json({
            message: `SignOut error ${error}`
        })

    }
}

// ================= GOOGLE AUTH =================
export const GoogleAuth = async (req, res) => {

    try {

        const { userName, email, photoUrl } = req.body

        let googlePhoto = photoUrl

        // Upload Google image to Cloudinary
        if (photoUrl) {

            try {

                googlePhoto = await uploadOnCloudinary(photoUrl)

            } catch (error) {

                console.log("Cloudinary upload failed", error)

            }
        }

        // Check existing user
        let user = await User.findOne({ email })

        // Create new user
        if (!user) {

            user = await User.create({
                userName,
                email,
                photoUrl: googlePhoto
            })

        } else {

            // Update photo if missing
            if (!user.photoUrl && googlePhoto) {

                user.photoUrl = googlePhoto

                await user.save()
            }
        }

        // Generate token
        const token = genToken(user._id)

        // Save cookie
        res.cookie("token", token, cookieOptions)

        return res.status(201).json(user)

    } catch (error) {

        return res.status(500).json({
            message: `GoogleAuth error ${error}`
        })

    }
}

// ================= SEND OTP =================
export const sendOtp = async (req, res) => {

    try {

        const email = String(req.body.email || "").trim().toLowerCase()

        // Find user
        const user = await User.findOne({ email })

        if (!user) {

            return res.status(400).json({
                message: "User not found"
            })
        }

        // Generate OTP
        const otp = Math.floor(
            1000 + Math.random() * 9000
        ).toString()

        // Save OTP
        user.resetOtp = otp
        user.otpExpires = Date.now() + 5 * 60 * 1000
        user.isOtpVerified = false

        await user.save()

        // Send email
        await sendMail(email, otp)

        return res.status(200).json({
            message: "OTP sent successfully"
        })

    } catch (error) {

        return res.status(500).json({
            message: `Send OTP Error ${error}`
        })

    }
}

export const verifyOtp = async (req,res)=>{
    try{
     const email = String(req.body.email || "").trim().toLowerCase()
     const otp = String(req.body.otp || "").trim()
     const user = await User.findOne({email})
     if(!user || String(user.resetOtp).trim() !== otp || user.otpExpires < Date.now()){
       return res.status(400).json({message:"Invalid OTP"})
     }
     user.resetOtp = undefined
     user.otpExpires = undefined
     user.isOtpVerified = true

     await user.save()
        return res.status(200).json({message:"OTP verified successfully"})
     

    } catch(error){
        return res.status(500).json({message:`OTP verification error:${error} `})
    }
}

export const resetPassword = async (req,res)=>{
    try{
      const {email,password} = req.body
      const user = await User.findOne({email})
      if(!user ||  !user.isOtpVerified ){
        return res.status(400).json({message:"OTp verification is required"})
      }
      const hashPassword = await bcrypt.hash(password,10)
      user.password=hashPassword,
      user.isOtpVerified= false,
      await user.save()
      return res.status(200).json({message:"Password reset successfully"})
    } catch(error){
     return res.status(500).json({message:`Password reset error:${error} `})
    }
}