const Animal = require("../../model/animal");

const getAnimalHistory = async (req, res) => {
  try {
    const { animalId } = req.query;

    if (!animalId) {
      return res.status(400).json({ message: "Animal ID is required" });
    }

    const animal = await Animal.findById(animalId)
      .populate("owner", "fullName mobileNo")   // farmer details
      .populate("treatments.vet", "fullName")   // vet details
      .populate("treatments.medicines.name", "name category"); // medicine details

    if (!animal) {
      return res.status(404).json({ message: "Animal not found" });
    }

    return res.status(200).json({
      message: "Animal history fetched successfully",
      animal,
    });
  } catch (err) {
    console.error("Error in getAnimalHistory:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = getAnimalHistory;
