import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// db in another continent
const dbConnect = async () => {
    try{
        const connect = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Connected Atlas DataBase of Shardendu Mishra`)
    }catch (error){
        return console.error(`Error: ${error.message}`)
    }
}

export default dbConnect;