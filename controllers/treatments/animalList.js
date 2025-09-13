const Animal = require("../../model/animal");

async function getAnimalByVet(req,res){
    try{
        const vetId = req.user?._id || req.query.vetId;

        if(!vetId){
            return res.status(400).json({error:"vetId is required"});
        }

        const animals = await Animal.find({"treatments.vet":vetId})
            .select("animalId species disease treatments.status")
            .populate("disease","name")
            .lean();
        
        return res.status(200).json({
            message:"animals by vet fetched successfully",
            animals:animals,
            vetId:vetId,
        });

    }catch(error){
        return res.status(500).json({error:error.message});
    }
}

module.exports = {
    getAnimalByVet,
}