const {createHmac,randomBytes } = require("crypto");
const {Schema,model} = require("mongoose");

const {createTokenForUser}=require('../services/authentication');

const userSchema = new Schema({
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
    salt:{
        type:String,
    },
    role:{
        type:String,
        enum:['farmer','vet','government'],
        required:true,
    }
},{timestamps:true});


userSchema.pre("save",function(next){
    const user = this;

    if(!user.isModified("password")) return; 

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac('sha256',salt)
    .update(this.password)
    .digest('hex');//convert hash bytes into hex to store in database

    user.salt = salt;
    user.password = hashedPassword;

    next();
});

userSchema.static('matchPasswordandGenerateToken',async function(mobileNo,password){
    const user=await this.findOne({mobileNo});

    if(!user) throw new Error('user not found');
    

    const salt=user.salt;
    const hashedPassword=user.password;

    const providedHash=createHmac('sha256',salt)
    .update(password)
    .digest('hex');

    if(hashedPassword!==providedHash) throw new Error('Password is incorrect');

    const token=createTokenForUser(user);

    return token;
})


const User = model("user",userSchema);

module.exports = User;
