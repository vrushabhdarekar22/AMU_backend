// controllers/animal/getClientMonthlyTreatments.js
const mongoose = require("mongoose");
const Animal = require("../../model/animal");

const getClientMonthlyTreatments = async (req, res) => {
  try {
    const { vetId, clientId } = req.query;
    const farmerId = clientId;

    if (!vetId || !farmerId) {
      return res.status(400).json({ message: "Vet ID and Farmer ID are required" });
    }

    // Current month range
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Count ongoing or started treatments in current month
    const results = await Animal.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(farmerId),
        },
      },
      { $unwind: "$treatments" },
      {
        $match: {
          "treatments.vet": new mongoose.Types.ObjectId(vetId),
          "treatments.startDate": { $lte: endOfMonth }, // started before or during this month
          $or: [
            { "treatments.endDate": { $gte: startOfMonth } }, // ends after month start
            { "treatments.endDate": null }, // ongoing without endDate
          ],
        },
      },
      { $count: "totalTreatments" },
    ]);

    const monthName = now.toLocaleString("default", { month: "long" });
    const year = now.getFullYear();

    return res.status(200).json({
      vetId,
      farmerId,
      monthlyCounts: [
        {
          period: `${monthName} ${year}`,
          totalTreatments: results.length > 0 ? results[0].totalTreatments : 0,
        },
      ],
    });
  } catch (err) {
    console.error("Error in getClientMonthlyTreatments:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = getClientMonthlyTreatments;
