import Joi from "joi";

import type { Request } from "express";

type TRequestBody = Request["body"];

//
//
// REGISTER
export const registerValidation = (data: TRequestBody) => {
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
export const loginValidation = (data: TRequestBody) => {
    const schema = Joi.object({
        email: Joi.string().min(6).email().required(),
        password: Joi.string().min(8).required(),
    });

    return schema.validate(data);
};

//
//
// EMAIL
export const resendConfEmailValidation = (data: TRequestBody) => {
    const schema = Joi.object({
        email: Joi.string().min(6).email().required(),
        password: Joi.string().min(8).required(),
    });

    return schema.validate(data);
};

export const emailValidation = (data: TRequestBody) => {
    const schema = Joi.object({
        email: Joi.string().min(6).email().required(),
    });

    return schema.validate(data);
};

//
//
// delete account
export const deleteAccountValidation = (data: TRequestBody) => {
    const schema = Joi.object({
        email: Joi.string().min(6).email(),
        password: Joi.string().min(8).required(),
    });

    return schema.validate(data);
};

//
//
// UPDATE user
export const updateUserValidation = (data: TRequestBody) => {
    const schema = Joi.object({
        firstName: Joi.string().max(100),
        middleName: Joi.string().max(100),
        lastName: Joi.string().max(100),
        details: Joi.string().max(1000),
        password: Joi.string().min(8).required(),
        dateOfBirth: Joi.date(),
    });

    return schema.validate(data);
};
