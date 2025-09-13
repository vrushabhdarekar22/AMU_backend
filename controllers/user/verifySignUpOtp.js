const signUpOtp = require("../../model/signUpOtp");
const User = require("../../model/user");

async function verifySignUpOtp(req,res){
    try{
        const {mobileNo,otp} = req.body;

        const record = await signUpOtp.findOne({mobileNo});

        if(!record){
            return res.status(400).json({error:"No OTP req found"});
        }


        if(record.otp !== otp){
            return res.status(400).json({error:"Invalid otp"});
        }

        console.log(`OTP for ${mobileNo} is ${otp}`); 

        if(record.expiresAt<Date.now()){
            return res.status(400).json({error:"OTP expired"});
        }

        //now otp is verified so we will create actual user 

        const user = await User.create({
            fullName:record.fullName,
            mobileNo:record.mobileNo,
            password:record.password,
            role:record.role,
        });

        //now we will delete temporary otp record
        await signUpOtp.deleteOne({mobileNo});

        return res.status(201).json({message:"Account created Successfully!!"});


    }catch(error){
         res.status(500).json({ error: error.message });
    }
}


module.exports = {
    verifySignUpOtp,
}