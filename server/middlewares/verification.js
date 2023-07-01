//imports
const jwt = require("jsonwebtoken");

// errors
const {
    nonExistenceError,
    endPointError,
    reqUserError,
    ownerAccessDenailError,
} = require("../utils/errorMessages");

// models
const User = require("../models/User");

// middleware token check function
module.exports.loggedInVerify = async (req, res, next) => {
    try {
        const token = req.header("auth-token");
        if (!token) throw { error: { status: 401, message: "Access Denied!" } };

        const verifiedUser = jwt.verify(token, process.env.TOKEN_SECRET, { expiresIn: "7d" });

        // req.user = verifiedUser;

        const userFound = await User.findById(verifiedUser._id);
        if (!userFound) throw nonExistenceError("login user account");

        req.user = userFound.toJSON();

        next();
    } catch (err) {
        if (process.env.NODE_ENV === "dev") console.error(err);
        return res.status(400).send(err);
    }
};

/**
 *  ### NOTE: Strictly use this middleware after _loggedInVerify_ middleware
 * Middleware for verifying logged in user is the owner of the req.params.userId account
 *
 * @param {object} req the request object
 * @param {object} res the response object
 * @param {function} next the next middleware function
 */
module.exports.paramAccountOwnerVerify = async (req, res, next) => {
    try {
        // check LOGGED IN
        if (!req.user._id) throw reqUserError;

        // check ENDPOINT
        if (!req.params.userId) throw endPointError;

        // get USER
        const paramUserFound = await User.findById(req.params.userId);
        if (!paramUserFound) throw nonExistenceError("user");

        // get IDs
        let _reqUserId = req.user._id.toString();
        let _paramUserId = paramUserFound._id.toString();

        // check IDs
        if (_reqUserId != _paramUserId) throw ownerAccessDenailError;

        // req.user = paramUserFound.toJSON();

        next();
    } catch (err) {
        if (process.env.NODE_ENV === "dev") console.error(err);
        res.status(400).send(err);
    }
};
