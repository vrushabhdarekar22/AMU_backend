const Animal = require("../../model/animal");


async function markDoseGiven(req,res){
    try{

        const {animalId,treatmentId,medicineId,time} = req.body || req.query;

        if (!animalId || !treatmentId || !medicineId || !time) {
            return res.status(400).json({ error: "animalId, treatmentId, medicineId, and time are required" });
        }

        const animal = await Animal.findOne({animalId});
        if(!animal){
            return res.status(404).json({error:"Animal not found"});
        }

        const treatment = animal.treatments.find(t => t._id.toString() === treatmentId)
        if(!treatment){
            return res.status(404).json({error:"Treatment not found"});
        }

        const medicine = treatment.medicines.find(m => m._id.toString() === medicineId);
        if(!medicine){
            return res.status(404).json({error:"Medicine not found"});
        }


        medicine.doseLogs.push({
            date:new Date(),
            timeOfDay: time,
            given: true,
        });

        await animal.save();

        return res.status(200).json({message:"dose marked as given"});


    }catch(error){
        return res.status(500).json({ error: error.message });
    }
}


module.exports = {
    markDoseGiven,
}