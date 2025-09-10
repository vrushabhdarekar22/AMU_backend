const User = require('../../model/user');

async function createAccount(req,res){
    const {fullName,mobileNo,password,role} = req.body;

    await User.create({
        fullName,
        mobileNo,
        password,
        role
    });

    res.status(201).json({message:'account created successfully'});
};

async function tologin(req,res){
    const {mobileNo,password} = req.body;

    try{
        const token = await User.matchPasswordandGenerateToken(mobileNo,password);
        return res.cookie("token",token).status(201).json({message:"login successfully"});
    }catch(error){
         res.status(401).json({error:"incorrect email or password"});
    }
};


module.exports={
    createAccount,
    tologin,
}