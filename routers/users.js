import chalk from "chalk";
import express from "express";
const router = express.Router();
import Joi from "joi"
import sendResponse from "../Helpers/sendResponse.js";
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

router.post("/register", async (req, res) => {
 try {
  const {error , value} = req.body;
  console.log("value=>",value)
    if(value) return sendResponse(res,201,false,value,"user registered")

 } catch (error) {
    console.log("error=>",error)
 }
});
export default router;