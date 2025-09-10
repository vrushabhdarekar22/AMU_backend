const Animal = require('../../model/animal');
const User = require('../../model/user');

async function getAllFarmersForVet(req, res) {
  const vetId = req.user?._id || req.query.vetId;
  if (!vetId) {
    return res.status(400).json({ error: 'vetId is required' });
  }

  try {
    const animals = await Animal.find({ 'treatments.vet': vetId }).populate('owner');

    const farmerMap = {};
    animals.forEach(animal => {
      if (animal.owner && animal.owner.role === 'farmer') {
        farmerMap[animal.owner._id] = animal.owner.fullName;
      }
    });
 const farmers = Object.values(farmerMap);

    res.json(farmers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getAllFarmersForVet };