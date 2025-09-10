const Animal = require('../../model/animal');

async function getMonthlyTreatments(req, res) {
  const vetId = req.user?._id || req.query.vetId;
  if (!vetId) {
    return res.status(400).json({ error: 'vetId is required' });
  }

  try {
    const animals = await Animal.find({ 'treatments.vet': vetId });

    const monthlyCounts = {};

    animals.forEach(animal => {
      animal.treatments.forEach(treatment => {
        if (treatment.vet.toString() === vetId.toString()) {
          const date = treatment.createdAt || treatment.date;
          if (date) {
            const month = new Date(date).toLocaleString('default', { month: 'long', year: 'numeric' });
            monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
          }
        }
      });
    });

    res.json(monthlyCounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getMonthlyTreatments };