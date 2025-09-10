const Animal = require('../../model/animal');
const User = require('../../model/user');

async function getFarmerCountForVet(req, res) {
  const vetId = req.user?._id || req.query.vetId;
  if (!vetId) {
    return res.status(400).json({ error: 'vetId is required' });
  }

  try {
    const animals = await Animal.find({ 'treatments.vet': vetId }).populate('owner');

    const farmerIds = new Set();
    animals.forEach(animal => {
      if (animal.owner && animal.owner.role === 'farmer') {
        farmerIds.add(animal.owner._id.toString());
      }
    });

    res.json({ farmerCount: farmerIds.size });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getFarmerCountForVet };