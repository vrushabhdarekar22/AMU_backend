const {Schema,model} = require("mongoose");

const diseaseSchema = new Schema({
    name:{
        type:String,
        required:true,
        
    },
    symptoms:[{type:String}],

});

const Disease = model('disease',diseaseSchema);

module.exports = Disease;