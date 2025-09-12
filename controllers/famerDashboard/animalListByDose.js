const Animal = require("../../model/animal");

async function getAnimalByDose(req,res){
    try{
        const farmerId = req.user?._id || req.query.farmerId;
        const {time} = req.query;
        if(!farmerId || !time) return res.status(400).json({error:"farmerId and time are required"});

        const today = new Date().toDateString();

        const animals = await Animal.find({owner:farmerId})
            .populate("treatments.vet","fullName")
            .populate("treatments.medicines.name","name")
            .lean();

        const result = animals.filter(animal =>
            animal.treatments.some(treat =>
                treat.status === "active" && 
                treat.medicines.some(med =>{
                    const alreadyGiven = med.doseLogs?.some(
                        log => new Date(log.date).toDateString() === today && log.timeOfDay === time && log.given
                    );

                    //returns for callback function
                    return med[`${time}Dosage`] && !alreadyGiven;
                })
            )
        );

        return res.status(200).json({
            message: "animals with pending doses fetched",
            animals: result,
        })

    }catch(error){
        return res.status(500).json({ error: error.message });
    }
}


module.exports = {
    getAnimalByDose,
}