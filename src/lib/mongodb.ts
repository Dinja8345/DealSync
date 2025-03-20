import mongoose from "mongoose";

const MONGODB_URL = process.env.DB_URL;

if(!MONGODB_URL){
    throw new Error("MONGODB_URL is not defined");
}

declare global {
    var mongooseConnection: mongoose.Connection | undefined;
}

export const connectDB = async() => {
    if(global.mongooseConnection){
        console.log("Using existing MongoDB connection");
        return global.mongooseConnection;
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URL, {
        dbName: "DebtSync", 
    });

    global.mongooseConnection = mongoose.connection;

    global.mongooseConnection.on("connected", () => {
        console.log("Mongo connected");
    });

    global.mongooseConnection.on("error", (err) => {
        console.error("MongoDB connectoin eeror:", err);
    });

    return global.mongooseConnection;
}