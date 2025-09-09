const {Schema,model}=require("mongoose");


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
        }
    }],
    status:{
        type:String,
        enum:['active','completed'],
    },
    reason:{
        type:String,
    },
    notes:{
        type:String,
    },
    effectiveness:{
        type:String,
        enum:['successful','unsuccessful']
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