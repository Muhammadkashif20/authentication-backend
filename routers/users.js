import chalk from "chalk";
import express from "express";
const router = express.Router();
import Joi from "joi"
import sendResponse from "../Helpers/sendResponse.js";
import Users from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// Validation Register Schema
const signUp = Joi.object({
    "fullname": Joi.string().required(),
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
        if (error) {
            return res.status(400).json({
                err: true,
                msg: error.details[0].message,
            });
        }
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
        sendResponse(res, 500, false, error.details, "Server Error");
    }
});

// login API
router.post("/login", async (req, res) => {
    const { error, value } = login.validate(req.body);
    console.log("req.body=>", req.body);
    // console.log("error=> ", error);
    try {
        if (error) {
            return res.status(400).json({
                err: true,
                msg: error.details[0].message,
            });
        }
        const user = await Users.findOne({ email: value.email })
        console.log("User=>", user);

        if (!user)
            return sendResponse(res, 400, true, null, "User is Not Registered");
        const isMatch = await bcrypt.compare(value.password, user.password);
        console.log("isMatch=>", isMatch);
        console.log("value.password=>", value.password);
        console.log("user.password=>", user.password);
        console.log("user.role=>", user.role);
        if (!isMatch)
            return sendResponse(res, 400, true, null, "Incorrect password");
        let token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role
            },
            process.env.AUTH_SECRET
        )

        const safeUser = {
            id: user._id,
            fullname: user.fullname,
            email: user.email,
            role: user.role
        };
        sendResponse(
            res,
            200,
            false,
            { user: safeUser, token },
            "User Logged In Successfully",
        );
    } catch (error) {
        console.log("Error=>", error);
    }
});



export default router;