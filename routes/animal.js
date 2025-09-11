const express = require('express');
const router = express.Router();
const { getDrugStatsByAnimal } = require('../controllers/analytics/drugfreq');
const { getMonthlyTreatments } = require('../controllers/analytics/monthly');
const { getDiseaseTrends } = require('../controllers/analytics/disease');
const { getAllFarmersForVet } = require('../controllers/farmers/allfarmer');
const { getFarmerCountForVet } = require('../controllers/farmers/countfarmerbyvet');
const getClientAnimalName = require("../controllers/farmers/getClientAnimalName");
const getClientActiveAnimalCount = require("../controllers/farmers/getClientActiveAnimalCount");

router.get('/client-active-animal-count', getClientActiveAnimalCount);
router.get('/client-animals', getClientAnimalName);
router.get('/farmer-count', getFarmerCountForVet);
router.get('/farmers', getAllFarmersForVet);
router.get('/disease-trends', getDiseaseTrends);
router.get('/monthly-treatments', getMonthlyTreatments);
router.get('/drugfreq', getDrugStatsByAnimal);

module.exports = router;