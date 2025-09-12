const Animal = require("../../model/animal");

async function getTotalTreatments(req,res){
    try{

        const farmerId = req.user?._id || req.query.farmerId;
        if(!farmerId){
            return res.status(400).json({error:"farmer id required"});
        }

        const animals = await Animal.find({owner:farmerId});

        let treatCount = 0;
        for(const animal of animals){
            for(const treat of animal.treatments){
                if(treat.status === "active"){
                    treatCount++;
                }
            }
        }


        return res.status(200).json({
            message:"total treat fetched successfully",
            farmerId,
            totalTreatments:treatCount,
        })
    }catch(error){
        return res.status(500).json({error:error.message});
    }
}

module.exports = {
    getTotalTreatments,
}