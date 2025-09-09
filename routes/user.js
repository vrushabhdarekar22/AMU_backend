const express = require('express');
const router = express.Router();


const User = require("../model/user");

router.get("/signin",(req,res)=>{
    res.json({message:'sigin page here'});
})

router.get("/signup",(req,res)=>{    
    res.json({message:'signup page here'}) 
});


router.post("/signup",async (req,res)=>{
    const {fullName,mobileNo,password,role} = req.body;

    await User.create({
        fullName,
        mobileNo,
        password,
        role
    });

    res.status(201).json({message:'account created successfully'});
});


router.post("/signin",async (req,res)=>{
    const {mobileNo,password} = req.body;

    try{
        const token = await User.matchPasswordandGenerateToken(mobileNo,password);
        return res.cookie("token",token).status(201).json({message:"login successfully"});
    }catch(error){
         res.status(401).json({error:"incorrect email or password"});
    }
});

module.exports = router;