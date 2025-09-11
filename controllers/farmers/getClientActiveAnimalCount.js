const Animal = require("../../model/animal");

const getClientActiveAnimalCount = async (req, res) => {
  try {
    const { vetId, clientId } = req.query; 

    if (!vetId || !clientId) {
      return res.status(400).json({ message: "Vet ID and Client ID are required" });
    }

    const activeAnimalCount = await Animal.countDocuments({
      owner: clientId,
      treatments: {
        $elemMatch: {
          vet: vetId,
          status: "active"
        }
      }
    });

    res.status(200).json({ activeAnimalCount });
  } catch (error) {
    console.error("Error in getClientActiveAnimalCount:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = getClientActiveAnimalCount;
