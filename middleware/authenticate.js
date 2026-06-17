import sendResponse from "../Helpers/sendResponse.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
import Users from "../models/Users.js";

export async function authenticateUser(req, res, next) {
  try {
    const bearerToken = req.headers.authorization;

    if (!bearerToken)
      return sendResponse(res, 401, true, null, "Token is Required");

    const token = bearerToken?.split(" ")[1];

    if (!token)
      return sendResponse(res, 401, true, null, "Token is Required");

    const decoded = jwt.verify(token, process.env.AUTH_SECRET);

    const user = await Users.findById(decoded._id);

    if (!user)
      return sendResponse(res, 401, true, null, "User not found");

    req.user = {
      _id: user._id,
      email: user.email,
      fullname: user.fullname,
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    return sendResponse(res, 401, true, null, "Invalid or Expired Token");
  }
}
