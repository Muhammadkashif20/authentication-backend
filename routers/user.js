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
      const {error,value} = signUp.validate(req.body)
      console.log("value",value)     
        res.status(201).json({msg:"User Register Successfully!"})
  } catch (error) {
    console.log("error=>",error)
    res.status(401).json({
      msg:'${error}'
    })
  }
});
export default router;