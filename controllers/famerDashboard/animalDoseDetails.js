const Animal = require("../../model/animal");

async function getAnimalDoseDetails(req,res){
    try{

        const {animalId} = req.query;
        const {time} = req.query;

        if(!animalId || !time) {
            return res.status(400).json({error:"animalId and time is required"});
        }

        const today = new Date().toDateString();

        const animal = await Animal.findOne({animalId})
            .select("animalId species treatments")
            .populate("treatments.medicines.name","name")
            .lean();


        if(!animal){
            return res.status(400).json({error:"Animal not found"});
        }


        const doses = [];

        for(const treat of animal.treatments){
            if(treat.status !== "active") continue;

            for(const med of treat.medicines){
                const alreadyGiven = med.doseLogs?.some(
                    log => new Date(log.date).toDateString() === today && log.timeOfDay === time && log.given
                );


                if(med[`${time}Dosage`] && !alreadyGiven){
                    doses.push({
                        treatmentId: treat._id,
                        medicineId: med._id,
                        drugName: med.name?.name || "Unknown",
                        dosage:med[`${time}Dosage`],
                        given:false
                    });
                }


            }
        }

        return res.status(200).json({
            message:"dose details fetched successfully",
            animalId: animal.animalId,
            doses,
        })

    }catch(error){
        return res.status(500).json({ error: error.message });
    }
}


module.exports = {
    getAnimalDoseDetails,
}