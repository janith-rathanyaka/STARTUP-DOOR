const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("../db");
const jwtGenerator = require("../utils/jwtGenerator");
const router = require("express").Router();
const validInfo = require("../middleware/validInfo");
const jwt = require("jsonwebtoken");
const nodemalier = require('../middleware/nodemalier');

require('dotenv').config();

// registation
router.post("/register",validInfo, async (req,res)=>{
    try {
        //1. req.body (name,email,password)
           
            var role = "Client";
            var status = 0;
            const {username,email,password} = req.body;
        //2.check if user exits
           const user = await pool.query("SELECT * from users WHERE username = $1",[username]);
          // var id = await pool.query("SELECT user_id from users order by id DESC LIMIT 1");
         //  
           if(user.rows.length !== 0){
               return res.status(401).send("User aleardy exist")
           }
        //3.bcrypt the user password
            const salt = await bcrypt.genSalt(10);
            const bcryptPassword = await bcrypt.hash(password,salt);
          //  res.json(bcryptPassword);
        //4. enter new user inside our database
          const token = jwt.sign({username:req.body.username},process.env.jwtSecret,{expiresIn:"1hr"});

            const newUser = await pool.query(
                "INSERT INTO users(username,role,password,token,status) VALUES($1,$2,$3,$4,$5)",
                [username,role,bcryptPassword,token,status]
            );
          //  res.json(newUser.rows[0]);
        //5. genrating our jwt token
             //  id = id+1;
            nodemalier.sendConfirmationEmail(
                username,
                email,
                token
            );
       //    const token = jwtGenerator(newUser.rows[0].password)
           res.json({token});
    } catch (err) {
        console.error(err.message);
    }
})

router.post("/login",validInfo, async (req,res)=>{
    try {
       //1.req.body

         const {username,password} = req.body;
       //2. check if user doesn't exits (if not then we throw error)
        const user = await pool.query("SELECT * FROM users where username = $1",[username]);

        if(user.rows.length === 0){
            return res.status(401).json("Password or username is incorrect");
        }
       //3. check if Incomming password is same database password
        const validPassword = await bcrypt.compare(password,user.rows[0].password);
        
         if(!validPassword){
            return res.status(401).json("Password or Email is incorrect"); 
         }
         const active = user.rows[0].status;
         if(active == 0){
            return res.status(401).json("Conform your account"); 
         }
         const role = user.rows[0].role;

       //  const token = jwtGenerator(user.rows[0].id);
        return res.json({role});

    } catch (err) {
        console.error(err.message);
    }
})

router.get('/confirm/:id',async (req,res,next)=>{
     const token = req.params.id;
     console.log(token);
     const user = await pool.query("UPDATE users SET status=1 where token=$1",[token]);

     console.log("Done");

})

router.post('/forgotpassword', async (req,res)=>{
    try {
        const {email} = req.body;
         console.log(email);
    } catch (err) {
        console.error(err.message);
    }
})


module.exports = router;
