import jwt from "jsonwebtoken"

const genToken = async (userId) => {
    try{
        const token = await jwt.sign({userId}, process.env.JWT_SECRET, {expireIn:"7d"})
        console.log(token)
        return token
    } catch (error){
        console.log(error)
    }
}
export default genToken