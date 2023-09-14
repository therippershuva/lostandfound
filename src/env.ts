import dotenv from "dotenv";
import { z } from "zod";

import { createEnv } from "@t3-oss/env-core";

import { ENV_FILE_PATH } from "./constants/dirConstants";

dotenv.config({ path: ENV_FILE_PATH });

export const env = createEnv({
    server: {
        NODE_ENV: z.enum(["dev", "prod"]),
        // SERVICE URI
        MONGO_URI: z.string().url(),
        // EMAIL
        GMAIL_USER: z.string().email(),
        GMAIL_PASS: z.string(),
        // SECRETS
        SECRET_KEY: z.string(),
    },
    runtimeEnv: {
        NODE_ENV: process.env.NODE_ENV,
        // SERVICE URI
        MONGO_URI: process.env.MONGO_URI,
        // EMAIL
        GMAIL_USER: process.env.GMAIL_USER,
        GMAIL_PASS: process.env.GMAIL_PASS,
        // SECRETS
        SECRET_KEY: process.env.SECRET_KEY,
    },
});
