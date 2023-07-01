const Joi = require("joi");
const { schema } = require("../models/User");

//
//
// REGISTER
module.exports.registerValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(5).required(),
        email: Joi.string().min(6).email().required(),
        password: Joi.string().min(8).required(),
    });

    return schema.validate(data);
};

//
//
// LOGIN
module.exports.loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).email().required(),
        password: Joi.string().min(8).required(),
    });

    return schema.validate(data);
};

//
//
// EMAIL
module.exports.resendConfEmailValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).email().required(),
        password: Joi.string().min(8).required(),
    });

    return schema.validate(data);
};

module.exports.emailValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).email().required(),
    });

    return schema.validate(data);
};

//
//
// delete account
module.exports.deleteAccountValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).email(),
        password: Joi.string().min(8).required(),
    });

    return schema.validate(data);
};

//
//
// UPDATE user
module.exports.updateUserValidation = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().max(100),
        middleName: Joi.string().max(100),
        lastName: Joi.string().max(100),
        bio: Joi.string().max(1000),
        password: Joi.string().min(8).required(),
        dateOfBirth: Joi.date(),
    });

    return schema.validate(data);
};
