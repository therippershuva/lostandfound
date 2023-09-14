import type { ValidationError } from "joi";

/**
 * Error template for all general errors
 *
 * @param {number} status
 * @param {string} type
 * @param {string} message
 * @returns {object}
 * ```javascript
 * {
 *   error: { status: status, type: "type", message: "message" }
 * }
 * ```
 */
export const errorMessage = (
    status: string | number,
    type: string,
    message: string,
) => {
    return {
        error: {
            status: status,
            type: type,
            message: message,
        },
    };
};

/**
 * Error template for Non-existence
 *
 * @param {string} entity reference entity which is to be defined
 * @returns {object}
 * ```javascript
 * {
 *   error: { status:404, type:"Non-existence", message:"Requested `entity` does not exist." }
 * }
 * ```
 */
export const nonExistenceError = (entity: string) => {
    return {
        error: {
            status: 404,
            type: "Not Found!",
            message: `Requested ${entity} does not exist.`,
        },
    };
};

/**
 *
 * @param {object} error Joi error object
 *
 * @returns {object}
 * ```javascript
 * {
 *    error: { type: "Req.body Validation error", message: error.details[0].message },
 * }
 * ```
 */
export const validationError = (error: ValidationError | Error | any) => {
    return {
        error: {
            type: "Req.body Validation error",
            message: error.details[0].message ?? error.message,
        },
    };
};

export const wrongPwError = {
    error: {
        status: 401,
        type: "Authentication failure",
        message: "Wrong Password.",
    },
};

export const reqBodyError = {
    error: {
        status: 400,
        type: "Request body error",
        message:
            "Request body does not contain necessary items, please refer documentation to check",
    },
};

export const reqUserError = {
    error: {
        status: 400,
        type: "Request body error",
        message:
            "Request does not contain a 'req.user'. \n Possible solutions: \t 1. include a 'req.user._id' \n\t 2. [backend] Use this middleware after 'loggedInVerify' middleware",
    },
};

export const endPointError = {
    error: {
        status: 400,
        type: "Request end-point error",
        message:
            "Request does not contain a 'req.params.userId' in the url end-point. \n Possible solutions: \t 1. Check the url end point to make sure it is correct",
    },
};

export const memberAccessDenailError = {
    error: {
        status: 401,
        type: "Access Denied!",
        message:
            "You do not have permission for access! Only owners and members may get access.",
    },
};

export const ownerAccessDenailError = {
    error: {
        status: 401,
        type: "Access Denied!",
        message: "You do not have permission for access! Only owners.",
    },
};

export const alreadyMemberError = {
    error: {
        status: 400,
        type: "Inconsequential Request!",
        message: "User is already a member of the classroom.",
    },
};

export const noMemberFoundError = {
    error: {
        status: 400,
        type: "Bad Request!",
        message: "Request member not found in the classroom.",
    },
};

export const notInvitedError = {
    error: {
        status: 400,
        type: "Bad Request!",
        message: "You have not been invited to this classroom.",
    },
};

export const notRequestedError = {
    error: {
        status: 400,
        type: "Bad Request!",
        message: "Queried user has not Requested to enroll in this classroom.",
    },
};
