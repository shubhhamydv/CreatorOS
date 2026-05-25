import mongoose from "mongoose";
 
const connectDb = async () =>{
    try {
        const mongoUri = process.env.MONGODB_URL?.trim()

        if (!mongoUri) {
            throw new Error("MONGODB_URL is not set")
        }

        await mongoose.connect(mongoUri)
        console.log("DB connected")
    } catch(error){
        console.error("DB error:", error?.message || error)

    }
}

export default connectDb