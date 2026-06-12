import express from "express";
const router = express.Router();
import Joi from "joi"
// Validation Register Schema
const signUp=Joi.object({
    "fullname":Joi.string().min(6).required(),
    "email":Joi.string().email().required(),
    "password":Joi.string().min(6).required(),
})
const login=Joi.object({
    "email":Joi.string().email().required(),
    "password":Joi.string().min(6).required(),
})
router.post("/signup",(req,res)=>{
  try {
    const {error,value}=signUp.validate(req.body)
    console.log("req.body",req.body)
    res.status().json()
  } catch (error) {
    console.log("error",error)
  } 
})
export default router;