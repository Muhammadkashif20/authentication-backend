import chalk from "chalk";
import express from "express";
const router = express.Router();
import Joi from "joi"
import sendResponse from "../Helpers/sendResponse.js";
import Users from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt  from 'jsonwebtoken';
// Validation Register Schema
const signUp = Joi.object({
    "fullname": Joi.string().min(6).required(),
    "email": Joi.string().email().required(),
    "password": Joi.string().min(6).required(),
})
const login = Joi.object({
    "email": Joi.string().email().required(),
    "password": Joi.string().min(6).required(),
})
// Register API

router.post("/register", async (req, res) => {
    try {
        const { error, value } = signUp.validate(req.body);
        console.log("value=>", value)
        if (error) return sendResponse(res, 400, false, error.details, "invalid Credentials");
        const user = await Users.findOne({ email: value.email });

        console.log("User_Email=>", user);
        if (user) return sendResponse(res, 400, false, null, "User Already Exists");
        const hashPass = await bcrypt.hash(value.password, 10)
        let newUser = new Users({
            ...value,
            password: hashPass,
        })
        newUser = await newUser.save()
        sendResponse(res, 201, true, newUser, "User Is Registered!")

    } catch (error) {
        console.log("error=>", error)
        sendResponse(res, 500, false, value, "Server Error");
    }
});

// login API
router.post("/login", async (req, res) => {
    const { error, value } = login.validate(req.body)
    console.log("value=>", value)
    try {
        if (error) return sendResponse(res, 400, false, error.details, "invalid Credentials");
        const user = await Users.findOne({ email: value.email });
        console.log("User_Email=>", user);
        if (!user) return sendResponse(res, 400, false, null, "User is not Register");
        const isMatch = await bcrypt.compare(value.password, user.password);
        console.log("isMatch=>", isMatch);
        if (!isMatch) return sendResponse(res, 400, true, null, "Incorrect password");
        let token=jwt.sign(user,process.env.AUTH_SECRET)
        sendResponse(res, 200, true, {user,token}, "User Logged in Successfully");
    }
    catch (error) {
        console.log("error=>", error)
        sendResponse(res, 500, false, value, "Server Error");
    }
});



export default router;