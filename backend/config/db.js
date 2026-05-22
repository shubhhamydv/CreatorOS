import mongoose from "mongoose";
 
const connectDb = async () =>{
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("DB connected")
    } catch(error){
        console.error("DB error:", error?.message || error)

    }
}

export default connectDb