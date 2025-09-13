const {Schema,model} = require("mongoose");

const signUpOtpSchema = new Schema({
    fullName:{
        type:String,
        required:true,
    },
    mobileNo:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['farmer','vet','government'],
        required:true,
    },
    expiresAt:{
        type:Date,
        default:()=>Date.now() + 5*60*1000,//in ms(5 min)
    }
},{timestamps:true});


const OTP = model('signUpOtp',signUpOtpSchema);

module.exports = OTP;