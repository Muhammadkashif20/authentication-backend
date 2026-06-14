import chalk from "chalk";
import express from "express";
const router = express.Router();
import Joi from "joi"
import sendResponse from "../Helpers/sendResponse.js";
import User from './../models/User.js';
import bcrypt  from 'bcrypt';
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
  const {error , value} = signUp.validate(req.body);
  console.log("value=>",value)
    if(error) return sendResponse(res,400,false,error.details,"invalid Credentials");
    let user=await User.find({email:value.email});
    console.log("User_Email=>",user);
    if(user) return sendResponse(res,400,false,null,"User Already Exists");
    const hashPass=await bcrypt.hash(value.password, 10)
    const newUser=new User({
        ...value,
        password:hashPass,
    })
    user=await newUser.save() 
    sendResponse(res,201,true,newUser,"User Is Registered!")
    
 } catch (error) {
    console.log("error=>",error)
     sendResponse(res,500,false,value,"Server Error");
 }
});
export default router;