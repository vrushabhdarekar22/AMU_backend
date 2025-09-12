const mongoose = require("mongoose");
const {Schema, model} = mongoose;

const treatmentSchema = new Schema({
    vet: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "user", 
        required: true 
    },
    startDate:{
        type:Date,
        default:Date.now,
    },
    endDate:{
        type:Date,
    },
    medicines:[{
        name:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"drug",
            required:true,
        },
        morningDosage:{
            type:String,
            required:true,          
        },
        afternoonDosage:{
            type:String,
            required:true,          
        },
        nightDosage:{
            type:String,
            required:true,          
        },
        duration:{
                type:String
        },
        waitingPeriod:{
            type:String,
        },
        doseLogs:[{
            date:{
                type:Date,
                default:Date.now
            },
            timeOfDay:{
                type:String,
                enum:["morning","afternoon","night"],
            },
            given:{
                type:Boolean,
                default:false,
            }
        }]
    }],
    status:{
        type:String,
        enum:['active','completed'],
        default:'active',
    },
    reason:{
        type:String,
    },
    notes:{
        type:String,
    },
    effectiveness:{
        type:String,
        enum:['successful','unsuccessful'],
        default:'successful',
    },
    
},{timestamps:true})


const animalSchema = new Schema({
    animalId:{
        type:String,
        required:true,
        unique:true,
    },
    species:{
        type:String,
        required:true,
    },
    age:{
        type:Number,
    },
    weight:{
        type:Number,
    },
    disease:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"disease",
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    },
    treatments:[treatmentSchema],
},{timestamps:true});

const Animal = model('animal',animalSchema,);

module.exports = Animal;