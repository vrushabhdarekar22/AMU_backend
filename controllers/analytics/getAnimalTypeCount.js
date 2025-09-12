const mongoose = require("mongoose");
const Animal = require("../../model/animal");

const getAnimalTypeCount = async (req, res) => {
  try {
    const { vetId } = req.query;

    if (!vetId) {
      return res.status(400).json({ message: "Vet ID is required" });
    }

    const results = await Animal.aggregate([
      {
        $match: {
          "treatments.vet": new mongoose.Types.ObjectId(vetId),
        },
      },
      {
        $group: {
          _id: "$species", // ✅ correct field from your schema
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          animalType: "$_id",
          count: 1,
        },
      },
    ]);

    return res.status(200).json({
      vetId,
      animalTypeCounts: results,
    });
  } catch (err) {
    console.error("Error in getAnimalTypeCount:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = getAnimalTypeCount;
