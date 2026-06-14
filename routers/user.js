import chalk from "chalk";
import express from "express";
const router = express.Router();
import Joi from "joi"
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
console.log(chalk.greenBright("Signup route is hit"))

router.post("/signup", async (req, res) => {
  try {
    const { error, value } = signUp.validate(req.body)
    console.log("value", value)
    if(error){
      res.status(401).json({msg:error})
    }
    else {
      res.status(201).json({ msg: "User Register Successfully!", success: true, data: value })
    }
    


  } catch (error) {
    console.log("error=>", error)
    res.status(401).json({
      msg: "server error"
    })
  }
});
export default router;