const signUpOtp = require("../../model/signUpOtp");

async function sendSignUpOtp(req,res){
    try{

        const {fullName,mobileNo,password,role} = req.body;

        if(!fullName || !mobileNo || !password || !role){
            return res.status(400).json({error:"All fields aare required"});
        }

        //here 4 digit otp is generated
        const otp = Math.floor(1000+Math.random()*9000).toString();

        await signUpOtp.findOneAndUpdate(
            {mobileNo},
            {fullName,mobileNo,password,role,otp,expiresAt:Date.now()+5*60*1000},
            {upsert:true,new:true},
        )
        //upsert :if exist it will update or it will create
        //new :gives updated document

        console.log(`OTP for ${mobileNo} is ${otp}`); 

        return res.status(200).json({message:"OTP sent successfully"});
    }catch(error){
        return res.status(500).json({error:error.message});
    }
}

module.exports = {
    sendSignUpOtp,
}