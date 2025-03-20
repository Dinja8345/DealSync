"use server"

import mongoose from "mongoose";

export const connectDB = async() => {
    try{
        const URL = process.env.DB_URL as string;
        console.log(mongoose);
        await mongoose.connect(URL,
            {
                sanitizeFilter: true
            }
        );
    }catch(err){
        console.error(err);
        throw new Error();
    }
};

export default connectDB;