import mongoose from "mongoose";

import { env } from "../../env";

export const connectDB = async () => {
    try {
        mongoose.set("strictQuery", false);
        const conn = await mongoose.connect(env.MONGO_URI);
        console.log(`Database Connected: ${conn.connection.host}`);
    } catch (error: Error | any) {
        console.log(error);
    }
};
