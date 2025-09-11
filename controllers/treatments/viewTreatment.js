const Animal = require("../../model/animal");


async function getTreatmentDetails(req,res){
    try{
        const animalId = req.query.animalId;

        if(!animalId){
            return res.status(400).json({ error: "animalId is required" });
        }

        const animal = await Animal.findOne({animalId}).populate('treatments');
        console.log(animal.treatments);
        
        if(!animal){
            return res.status(404).json({ error: "Animal not found" });
        }


        const activeTreatment = animal.treatments.filter(
            (treat) => treat.status === "active"
        );


        return res.status(201).json({
            message:"current treatment fetched successfully",
            animal: {
                animalId: animal.animalId,
                species: animal.species,
                age: animal.age,
                weight: animal.weight,
                disease: animal.disease,
                owner: animal.owner,
            },
            currentTreatments: activeTreatment,
        })

    }catch(error){
        res.status(500).json({ error: error.message });
    }
}


module.exports = {
    getTreatmentDetails,
}