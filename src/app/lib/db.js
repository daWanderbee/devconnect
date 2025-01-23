import mongoose from "mongoose";

global.mongoose = global.mongoose || {
    conn: null,
    promise: null,
};

export async function dbConnect() {
    if (global.mongoose.conn) {
        console.log("Using existing connection");
        return global.mongoose.conn;
    } else {
        const conString = process.env.MONGO_URI;
        if (!conString) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }

        if (!global.mongoose.promise) {
            global.mongoose.promise = mongoose.connect(conString, {
                autoIndex: true,
            });
        }

        try {
            global.mongoose.conn = await global.mongoose.promise;
            console.log("New connection established");
            return global.mongoose.conn;
        } catch (error) {
            console.error("Error connecting to MongoDB:", error);
            throw new Error("Database connection failed");
        }
    }
}
