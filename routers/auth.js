import express from "express";
const router = express.Router();
import Joi from "joi";
import bcrypt from "bcrypt";
import "dotenv/config";
import jwt from "jsonwebtoken";
import sendResponse from "../Helpers/sendResponse.js";
import Users from "../models/Users.js";
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  fullname: Joi.string().min(3).required(),
  password: Joi.string().min(6).optional(),
});
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
router.post("/register", async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    console.log("req.body=>", req.body);
    console.log("error=> ", error);
    if (error) return sendResponse(res, 400, true, null, error.message);
    console.log("value=> ", value);
    const user = await Users.findOne({ email: value.email });
    if (user) return sendResponse(res, 400, true, null, "User Already Exists");
    // after add new user generate a random password with converted into hashed:-
    let genRandomPass = Math.random().toString(36).slice(-8);
    let hashPass = await bcrypt.hash(genRandomPass, 8);
    console.log("hashPass=>", hashPass);
    console.log("genRandomPass=>", genRandomPass);
    let newUser = new Users({
      ...value,
      password: hashPass,
    });
    newUser = await newUser.save();
    console.log("newUser=> ", newUser);
    sendResponse(res, 201, false, newUser, "User Registered Successfully");
    console.log("user.email=>", value.email);
    console.log("user.fullname=>", value.fullname);

  } catch (error) {
    console.log("Error=>", error);
    sendResponse(res, 500, true, null, "Internal server error");
  }
});
router.post("/login", async (req, res) => {
  const { error, value } = loginSchema.validate(req.body);
  console.log("req.body=>", req.body);
  // console.log("error=> ", error);
  try {
    if (error) return sendResponse(res, 400, true, null, "Invalid Credentials");
    const user = await Users.findOne({ email: value.email })
      .select("+password")
      .lean();
    console.log("User=>", user);

    if (!user)
      return sendResponse(res, 400, true, null, "User is Not Registered");
    const isMatch = bcrypt.compare(value.password, user.password);
    console.log("isMatch=>", isMatch);
    console.log("value.password=>", value.password);
    console.log("user.password=>", user.password);
    console.log("user.role=>", user.role);
    if (!isMatch)
      return sendResponse(res, 400, true, null, "Incorrect password");
    var token = jwt.sign(user, process.env.AUTH_SECRET);
    sendResponse(
      res,
      201,
      false,
      { user, token },
      "User Logged In Successfully",
    );
  } catch (error) {
    console.log("Error=>", error);
  }
});

export default router;
