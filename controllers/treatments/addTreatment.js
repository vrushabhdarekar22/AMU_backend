const Animal = require('../../model/animal');
const Disease = require('../../model/disease');
const Drug = require('../../model/drug');


async function addTreatment(req,res) {
    const session = await Animal.startSession();
    session.startTransaction();
    try{
        const {animalId,treatments,disease} = req.body;
        const vetId = req.user?._id || req.query.vetId;

        if(!vetId){
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({error:"vet id is required"});
        }

        //1.create disease document
        const diseaseDoc = await Disease.create([{
            name:disease.name,
            symptoms:disease.symptoms || [],
        }],{session});

        const medicinesDocs = [];

        //2.drug doc for each medicine
        for(const med of treatments.medicines){
            const [drugDoc] = await Drug.create([{
                name: med.name,
                category: med.category || "",
                dosageForms: med.dosageForms || "",
                withdrawalPeriod: med.withdrawalPeriod || "",
            }],{session});


            medicinesDocs.push({
                ...med,
                name:drugDoc._id,
            });
        }

            //3.creating animal if not exist
            let animal = await Animal.findOne({animalId}).session(session);
            if(!animal){
                animal = await Animal.create([{
                    animalId,
                    species:req.body.species || "unknown",
                    age:req.body.age || null,
                    weight: req.body.weight || null,
                    owner: req.body.owner,
                    disease: diseaseDoc._id,
                    treatments: [],
                }],{session});
                animal = animal[0];
            }else{
                //animal already exist just we will assign disease
                animal.disease = diseaseDoc[0]._id;
            }

            //4.add treatment to animal
            const newTreatment = {
                vet: vetId,
                startDate: treatments.startDate,
                endDate: treatments.endDate,
                medicines: medicinesDocs,
                status: treatments.status,
                reason: treatments.reason,
                notes: treatments.notes,
                effectiveness: treatments.effectiveness,
            };

            //push newTreat in treatments
            animal.treatments.push(newTreatment);
            await animal.save({session});


            await session.commitTransaction();
            session.endSession();

            res.status(201).json({message:"treatment added successfully",animal});


        

    }catch(error){
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    addTreatment,
}