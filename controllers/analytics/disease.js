const Animal = require('../../model/animal');
const Disease = require('../../model/disease');

async function getDiseaseTrends(req, res) {
  try {
    const diseases = await Disease.find({});
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 2, 1);

    
    const result = [];

    for (const disease of diseases) {
      const totalCases = await Animal.countDocuments({ disease: disease._id });

      // Last month cases
      const lastMonthCases = await Animal.countDocuments({
        disease: disease._id,
        createdAt: { $gte: lastMonth, $lt: now }
      });

      // Previous month cases
      const prevMonthCases = await Animal.countDocuments({
        disease: disease._id,
        createdAt: { $gte: prevMonth, $lt: lastMonth }
      });

      // Determine trend
      let trend = 'Stable';
      if (lastMonthCases > prevMonthCases) trend = 'Up';
      else if (lastMonthCases < prevMonthCases) trend = 'Down';

      result.push({
        name: disease.name,
        cases: totalCases,
        trend
      });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getDiseaseTrends };