import express from "express";
const router = express.Router();
import Joi from "joi"
// Validation Register Schema
const signUp=Joi.object({
    "name":Joi.string().min(6).required(),
    "email":Joi.string().min().required(),
    "password":Joi.string().min(4).required(),
})
const login=Joi.object({
    "email":Joi.string().min().required(),
    "password":Joi.string().min(6).required(),
})
router.post("/register")
