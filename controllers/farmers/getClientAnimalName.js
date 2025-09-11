const Animal = require("../../model/animal");

const getClientAnimalName = async (req, res) => {
  try {
    const { vetId, clientId } = req.query; 

    if (!vetId || !clientId) {
      return res.status(400).json({ message: "Vet ID and Client ID are required" });
    }

    const animals = await Animal.find({
      owner: clientId,
      "treatments.vet": vetId
    }).select("animalId species"); 

    const animalNames = animals.map(animal => animal.animalId);

    res.json({
      message: "Animals fetched successfully",
      animals: animalNames
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = getClientAnimalName;
