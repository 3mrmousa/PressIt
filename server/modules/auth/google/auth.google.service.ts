import { OAuth2Client } from "google-auth-library";
import AppError from "../../../utils/errors/AppError.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async (token: string) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload?.email) {
    throw new AppError("Invalid Google token", 401);
  }

  return {
    email: payload.email,
    firstName: payload.given_name,
    lastName: payload.family_name,
    picture: payload.picture,
  };
};
