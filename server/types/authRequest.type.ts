import { Request } from "express";
import { IUser } from "./user.types.js";

interface AuthRequest extends Request {
  user?: IUser;
}

export type { AuthRequest };
