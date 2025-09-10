const Animal = require('../../model/animal');
const Drug = require('../../model/drug');

async function getDrugStatsByAnimal(req, res) {
  const { species } = req.query;
  if (!species) {
    return res.status(400).json({ error: 'species is required' });
  }

  try {
    
    const drugs = await Drug.find({});
    const drugStats = {};

    
    drugs.forEach(drug => {
      drugStats[drug._id] = {
        name: drug.name,
        successful: 0,
        unsuccessful: 0
      };
    });

    
    const animals = await Animal.find({ species });

    animals.forEach(animal => {
      animal.treatments.forEach(treatment => {
        treatment.medicines.forEach(med => {
          const drugId = med.name.toString();
          if (drugStats[drugId]) {
            if (treatment.effectiveness === 'successful') drugStats[drugId].successful++;
            if (treatment.effectiveness === 'unsuccessful') drugStats[drugId].unsuccessful++;
          }
        });
      });
    });

    
    const result = Object.values(drugStats);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getDrugStatsByAnimal };