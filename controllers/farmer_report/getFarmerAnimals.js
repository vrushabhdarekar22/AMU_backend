const Animal = require("../../model/animal");

const getFarmerAnimals = async (req, res) => {
  try {
    const { farmerId } = req.query;

    if (!farmerId) {
      return res.status(400).json({ message: "Farmer ID is required" });
    }

    // Fetch all animals belonging to farmer
    const animals = await Animal.find({ owner: farmerId }).select("animalId species");

    return res.status(200).json({
      message: "Animals fetched successfully",
      animals,  // returns array like [{ _id, animalId, species }]
    });
  } catch (err) {
    console.error("Error in getFarmerAnimals:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = getFarmerAnimals;
