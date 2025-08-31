import mongoose from "mongoose";

export const connectDB = async () =>{
    try{
        const conn =await mongoose.connect(process.env.MONGO_URI);
        console.log(`MangoDB Connected: ${conn.connection.host}`);
    }catch(error){
        console.log("Error in connecting to MangoDB",error);
        process.exit(1);

    }
}