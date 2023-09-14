import { TUser } from "@/server/models/User";
import { Locals, Request } from "express";

export type CustomLocals = Locals & {
    title?: string;
    description?: string;
    user?: TUser;
    loggedIn?: boolean;
    isAdmin?: boolean;
    token?: string;
};

export type TCustomResponse = Response & {
    locals: CustomLocals;
};
