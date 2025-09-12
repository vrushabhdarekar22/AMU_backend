const mongoose = require("mongoose");
const Animal = require("../../model/animal");

const getClientAnimals = async (req, res) => {
  try {
    const { vetId, clientId } = req.query;

    if (!vetId || !clientId) {
      return res.status(400).json({ message: "Vet ID and Client ID are required" });
    }

    // Count all animals under this farmer treated by this vet
    const totalAnimals = await Animal.countDocuments({
      owner: new mongoose.Types.ObjectId(clientId),
      "treatments.vet": new mongoose.Types.ObjectId(vetId),
    });

    return res.status(200).json({
      message: "Animals fetched successfully",
      totalAnimals,  
    });
  } catch (err) {
    console.error("Error in getClientAnimals:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = getClientAnimals;
