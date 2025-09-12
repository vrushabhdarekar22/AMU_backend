const Animal = require("../../model/animal");

async function getDoseCounts(req,res){
    try{
        const farmerId = req.user?._id || req.query.farmerId;

        if(!farmerId) return res.status(400).json({error:"farmerId is required"});

        const animals = await Animal.find({owner:farmerId}).lean();

        const today = new Date().toDateString();
        const counts = {morning:0,afternoon:0,night:0};


        for(const animal of animals){
            for(const treat of animal.treatments){
                if(treat.status !== "active") continue;

                for(const med of treat.medicines){
                    for(const time of ["morning","afternoon","night"]){
                        if(med[time+"Dosage"]){
                            const alreadyGiven = med.doseLogs?.some(
                                log => new Date(log.date).toDateString() === today &&
                                log.timeOfDay === time &&
                                log.given === true
                            );

                            if(!alreadyGiven) counts[time] +=1;
                        }
                    }
                }
            }
        }

        return res.status(200).json({
            message:"counts fetched successfully",
            counts,
        });

    }catch(error){
        return res.status(500).json({error:error.message});
    }
}

module.exports = {
    getDoseCounts,
};