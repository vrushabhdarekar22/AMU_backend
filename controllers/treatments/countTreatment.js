const Animal = require("../../model/animal");

async function getVetMonthlyStats(req,res){
    try{
        const vetId = req.user?._id || req.query.vetId;

        if (!vetId) {
            return res.status(400).json({ error: "vet id is required" });
        }


        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(),now.getMonth(),1);


        const animals = await Animal.find({ "treatments.vet": vetId });

        let total = 0, active = 0, completed = 0;

        for(const animal of animals){
            for(const treat of animal.treatments){
                if(treat.vet.toString() === vetId.toString() && new Date(treat.startDate) >= startOfMonth){
                    total++;

                    if(treat.status === "active") active++;
                    if(treat.status === "completed") completed++;
                }
            }
        }


        return res.status(201).json({
            message:"monthly stats fetched successfully",
            vetId:vetId,
            totaltreatments: total,
            activeTreatments: active,
            completedTreatments:completed,
        });
    }catch(error){
        res.status(500).json({ error: error.message });
    }

}


module.exports = {
    getVetMonthlyStats,
}