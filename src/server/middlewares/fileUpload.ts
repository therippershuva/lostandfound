import fs from "fs";
import multer from "multer";
import path from "path";

import { env } from "../../env";

import type { Request } from "express";

export type TMulterFile<T = Express.Multer.File> = T;
export type TMulterFiles<T = Express.Multer.File[]> = T;

const storage = multer.diskStorage({
    destination: function (req: Request, file: TMulterFile, cb) {
        cb(null, "uploads/"); // Specify the directory to store the uploaded files
    },
    filename: function (req: Request, file: TMulterFile, cb) {
        cb(null, file.originalname); // Use the original filename for the stored file
    },
});

const userStorage = multer.diskStorage({
    destination: function (req: Request, file: TMulterFile, cb) {
        let directory = `./public/upload/users`;

        let checkDirectory = `${process.cwd()}/public/upload/users`;
        if (!fs.existsSync(checkDirectory)) {
            fs.mkdirSync(checkDirectory, { recursive: true });
        }
        cb(null, directory);
    },
    filename: function (req: Request, file: TMulterFile, cb) {
        let name = file.fieldname + "-" + Date.now();
        let extension = path.extname(file.originalname);

        cb(null, name + extension);
    },
});

const fileFilter = function fileFilter(
    req: Request,
    file: TMulterFile,
    cb: multer.FileFilterCallback,
) {
    try {
        const ext = path.extname(file.originalname);
        if (ext != ".jpg" && ext != ".jpeg" && ext != ".png" && ext != ".gif") {
            throw {
                status: 400,
                type: "mimetype error",
                message: "Only images are allowed",
            };
        }
        // return no error if image
        return cb(null, true);
    } catch (error: Error | any) {
        if (env.NODE_ENV === "dev") console.log(error);
        return cb(null, false);
    }
};

export const formData = multer({ storage: storage });

export const imagesUpload = multer({
    storage: userStorage,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter: fileFilter,
}).fields([{ name: "images", maxCount: 4 }]);
