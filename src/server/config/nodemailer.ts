import nodemailer from "nodemailer";

import { env } from "../../env";

// transporter
export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
        user: env.GMAIL_USER,
        pass: env.GMAIL_PASS,
    },
});

// verify connection
export const verifyConnection = async () => {
    transporter.verify((error, success) => {
        if (error) {
            console.log(error);
        } else {
            console.log("Server is ready to send messages");
        }
    });
};
