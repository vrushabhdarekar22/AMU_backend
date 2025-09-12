const Animal = require("../../model/animal");

async function getTreatmentHistory(req,res){

    try{

        const animalId = req.query.animalId;

        if(!animalId){
            return res.status(400).json({ error: "animalId is required" });
        }

        const animal = await Animal.findOne({animalId}).populate('disease','name symptoms');

        if(!animal){
            return res.status(404).json({ error: "Animal not found" });
        }

        return res.status(200).json({
            message:"history fetched successfully",
            animalId:animalId,
            treatments:animal.treatments,
        })
    }catch(error){
        res.status(500).json({ error: error.message });
    }


}

module.exports = {
    getTreatmentHistory,
}