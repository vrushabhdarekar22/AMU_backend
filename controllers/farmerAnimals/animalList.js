const Animal = require("../../model/animal");

async function getAnimalByFarmer(req,res){
    try{
        const farmerId = req.user?._id || req.query.farmerId;

        if(!farmerId){
            return res.status(400).json({error:"farmerId is required"});
        }

        const animals = await Animal.find({"owner":farmerId})
            .select("animalId species disease treatments.status")
            .populate("disease","name")
            .lean();
        
        return res.status(200).json({
            message:"animals by farmer fetched successfully",
            animals:animals,
            farmerId:farmerId,
        });

    }catch(error){
        return res.status(500).json({error:error.message});
    }
}

module.exports = {
    getAnimalByFarmer,
}