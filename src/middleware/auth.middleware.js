import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken"
import { asynchandling } from "../utils/AsyncHandler.js";

export const VerifyJWT = asynchandling(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    console.log(token+"token"+"h");
    if (!token) {
      throw new ApiError(401, "Unauthorize request");
    }

    const decodedToken = jwt.verify(token, process.env.Access_Token_Secret);

    const Users = await User
      .findById(decodedToken._id)
      .select("-password -refreshtoken");

    if (!Users) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = Users;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});