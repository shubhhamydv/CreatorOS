// ================= USER CONTROLLER =================

import uploadOnCloudinary from "../config/cloudinary.js"
import Channel from "../model/channelModel.js"
import User from "../model/userModel.js"

// ================= GET CURRENT USER =================

export const getCurrentUser = async (req, res) => {

    try {

        const user = await User.findById(req.userId)
            .select("-password")

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        return res.status(200).json({
            success: true,
            user
        })

    } catch (error) {

        console.log("Get Current User Error:", error)

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

// ================= CREATE CHANNEL =================

export const createChannel = async (req, res) => {

    try {

        const { name, description, category } = req.body

        const userId = req.userId

        // validation
        if (!name || !description || !category) {

            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        // existing channel check
        const existingChannel = await Channel.findOne({
            owner: userId
        })

        if (existingChannel) {

            return res.status(400).json({
                success: false,
                message: "User already has a channel"
            })
        }

        // unique channel name check
        const channelNameExists = await Channel.findOne({
            name: name.trim()
        })

        if (channelNameExists) {

            return res.status(400).json({
                success: false,
                message: "Channel name already taken"
            })
        }

        let avatarUrl = ""
        let bannerUrl = ""

        // upload avatar
        if (req.files?.avatar?.[0]) {

            avatarUrl = await uploadOnCloudinary(
                req.files.avatar[0].path
            )
        }

        // upload banner
        if (req.files?.banner?.[0]) {

            bannerUrl = await uploadOnCloudinary(
                req.files.banner[0].path
            )
        }

        // create channel
        const newChannel = await Channel.create({

            name: name.trim(),

            description: description.trim(),

            category: category.trim(),

            avatar: avatarUrl,

            banner: bannerUrl,

            owner: userId
        })

        // update user
        await User.findByIdAndUpdate(
            userId,
            {
                channel: newChannel._id,
                userName: newChannel.name,
                photoUrl: avatarUrl
            },
            { new: true }
        )

        return res.status(201).json({

            success: true,

            message: "Channel created successfully",

            channel: newChannel
        })

    } catch (error) {

        console.log("Create Channel Error:", error)

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"
        })
    }
}

// ================= UPDATE CHANNEL =================

export const updateChannel = async (req, res) => {

    try {

        const { name, description, category } = req.body

        const userId = req.userId

        // find channel
        const channel = await Channel.findOne({
            owner: userId
        })

        if (!channel) {

            return res.status(404).json({
                success: false,
                message: "Channel not found"
            })
        }

        // update name
        if (name && name !== channel.name) {

            const nameExists = await Channel.findOne({
                name: name.trim()
            })

            if (nameExists) {

                return res.status(400).json({
                    success: false,
                    message: "Channel name already taken"
                })
            }

            channel.name = name.trim()
        }

        // update description
        if (description !== undefined) {

            channel.description = description.trim()
        }

        // update category
        if (category !== undefined) {

            channel.category = category.trim()
        }

        // update avatar
        if (req.files?.avatar?.[0]) {

            const avatarUrl = await uploadOnCloudinary(
                req.files.avatar[0].path
            )

            channel.avatar = avatarUrl
        }

        // update banner
        if (req.files?.banner?.[0]) {

            const bannerUrl = await uploadOnCloudinary(
                req.files.banner[0].path
            )

            channel.banner = bannerUrl
        }

        // save updated channel
        const updatedChannel = await channel.save()

        // update user
        await User.findByIdAndUpdate(
            userId,
            {
                userName: updatedChannel.name,
                photoUrl: updatedChannel.avatar
            },
            { new: true }
        )

        return res.status(200).json({

            success: true,

            message: "Channel updated successfully",

            channel: updatedChannel
        })

    } catch (error) {

        console.log("Update Channel Error:", error)

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"
        })
    }
}

// ================= GET MY CHANNEL =================

export const getMyChannel = async (req, res) => {

    try {

        const userId = req.userId

        const channel = await Channel.findOne({
            owner: userId
        }).populate("owner", "-password")

        if (!channel) {

            return res.status(404).json({
                success: false,
                message: "Channel not found"
            })
        }

        return res.status(200).json({

            success: true,

            channel
        })

    } catch (error) {

        console.log("Get My Channel Error:", error)

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"
        })
    }
}