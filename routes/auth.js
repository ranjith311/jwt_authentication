const router = require('express').Router()
const pool = require('../model/pg_init')
const { body,check, validationResult } = require('express-validator');
const validate = require('../helpers/registerValidation');
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const check_jwt = require('../middleware/check_jwt');


router.get("/register",(req,res,next)=>{
    try {
        res.render("register")
    } catch (error) {
        console.log(error.message)
    }
})




router.post("/register",validate,async(req,res)=>{
   try {
   
   const {user_name,email,password}= req.body
  
   //Validate the incoming data
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
    throw errors.errors
   }

   //Check if the user exists or not
   const isExist = await pool.query(`SELECT email from users WHERE email = $1`,[email],)
   if(isExist.rows.length != 0){
    throw ("User already exists")
   }

   //Create user
   const hash = await bcrypt.hash(password,12)
   await pool.query(`INSERT INTO users (name,email,password) VALUES ($1, $2, $3)`,[user_name,email,hash])


   //Generate jwt
   const maxAge = 24 * 60 * 60 * 1000 //24 Hours
   const token = jwt.sign({email}, process.env.JWT_SECRET_KEY);
  

   //set cookie & grant access 
   res.cookie('jwt', token,{ maxAge:maxAge , httpOnly: true });
   res.status(200).json({message:"success",url:"/api/home"})


   } catch (error) {
    console.log(error)
    res.status(400).json({message:error})
   }
})






router.get("/login",(req,res,next)=>{
    try {
        res.render("login")
    } catch (error) {
        console.log(error.message);
    }
})


router.post("/login",async(req,res)=>{
    try {
        const {email,password} = req.body
        //validate the incoming data

        //check if the user exists or not
        const isExist = await pool.query(`SELECT * from users WHERE email = $1`,[email],)
        if(isExist.rowCount==0){
            throw ("No user found with this email")
        }

        //verify password
        const user=isExist.rows[0]
        console.log(user)
        const verify = await bcrypt.compare(password,user.password)
        console.log(verify)
        if(verify){
            //generate token
             const maxAge = 24 * 60 * 60 * 1000 //24 Hours
             const token = jwt.sign({email}, process.env.JWT_SECRET_KEY);
  
            //set cookie & grant access 
             res.cookie('jwt', token,{ maxAge:maxAge , httpOnly: true });
             res.status(200).json({success:true,url:"/api/home"})

        }else{
            throw ("Email or password is incorrect")
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({message:error})
    }
})




router.delete("/logout",(req,res)=>{
    res.clearCookie('jwt');
    res.status(200).json({success:true,url:"/api/login"})
})

router.get("/home",check_jwt,(req,res)=>{
    try {
      res.render("home")
    } catch (error) {
        console.log(error.message)
    }
})


module.exports = router