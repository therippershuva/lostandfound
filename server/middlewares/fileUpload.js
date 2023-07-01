const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

// Set up the storage for uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // Specify the directory to store the uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Use the original filename for the stored file
    },
});

// Create the multer instance and specify the storage
const formData = multer({ storage: storage });

/**
 * ### User Storage
 *
 * Destination: `./public/upload/users/${userId}`
 */
const userStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        let userId = req.user._id.toString();
        let directory = `./public/upload/users/${userId}`;

        let checkDirectory = `${process.cwd()}/public/upload/users/${userId}`;
        if (!fs.existsSync(checkDirectory)) {
            fs.mkdirSync(checkDirectory, { recursive: true });
        }
        cb(null, directory);
    },
    filename: function (req, file, cb) {
        let name = req.user.username + "-" + file.fieldname + "-" + Date.now();
        let extension = path.extname(file.originalname);

        cb(null, name + extension);
    },
});

/**
 * ### File Filtering for User Profile Images
 */
const fileFilter = function fileFilter(req, file, cb) {
    try {
        const ext = path.extname(file.originalname);
        if (ext != ".jpg" && ext != ".jpeg" && ext != ".png" && ext != ".gif") {
            throw {
                error: {
                    status: 400,
                    type: "mimetype error",
                    message: "Only images are allowed",
                },
            };
        }
        // return no error if image
        return cb(null, true);
    } catch (err) {
        if (process.env.NODE_ENV === "dev") console.log(err);
        return cb(null, false);
    }
};

/**
 * ### Multer Middleware for Profile Images Upload
 *
 * Destination: `public/upload/users/userId`
 */
module.exports.imagesUpload = multer({
    storage: userStorage,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter: fileFilter,
}).fields([
    { name: "avatar", maxCount: 1 },
    { name: "cover", maxCount: 1 },
]);
