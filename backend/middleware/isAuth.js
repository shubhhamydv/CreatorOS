import jwt from 'jsonwebtoken'

const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies?.token

        if (!token) {
            return res.status(401).json({
                message: "User doesn't have token"
            })
        }

        const verifyToken = jwt.verify(token, process.env.JWT_SECRET)

        if (!verifyToken || !verifyToken.userId) {
            return res.status(401).json({
                message: "Invalid token"
            })
        }

        req.userId = verifyToken.userId
        next()
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        })
    }
}

export default isAuth