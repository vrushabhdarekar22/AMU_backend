const {Schema,model} = require("mongoose");

const drugSchema = new Schema({
    name:{
        type:String,
        required:true,
        // unique:true,
    },
    category:{
        type:String,
        enum:["Antibiotic","Antiviral","Antifungal"],
    },
    dosageForms:{
        type:String,
    },
    withdrawalPeriod:{
        type:String,
    }
},{timestamps:true});

const Drug = model('drug',drugSchema);
module.exports = Drug;