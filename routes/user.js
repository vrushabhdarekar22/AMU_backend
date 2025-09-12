const express = require('express');
const router = express.Router();

const {createAccount,tologin} = require("../controllers/user/createAccount");
const {addTreatment} = require("../controllers/treatments/addTreatment");
const {getTreatmentHistory} = require("../controllers/treatments/treatmentHistory");
const {getTreatmentDetails} =require("../controllers/treatments/viewTreatment");
const {getVetMonthlyStats} = require("../controllers/treatments/countTreatment");

const {getTotalTreatments} = require("../controllers/famerDashboard/countTreatments");
const {getDoseCounts} =require("../controllers/famerDashboard/doseCounts");
const {getAnimalByDose} =require("../controllers/famerDashboard/animalListByDose");
const {getAnimalDoseDetails} =require("../controllers/famerDashboard/animalDoseDetails");
const {markDoseGiven} =require("../controllers/famerDashboard/doseGiven");

router.post("/signup",createAccount);
router.post("/signin",tologin);


//vet
router.post("/add-treatment",addTreatment);
router.get("/view-history",getTreatmentHistory);
router.get("/view-treatment-details",getTreatmentDetails);
router.get("/monthly-stats",getVetMonthlyStats);


//farmer
router.get("/total-treatments",getTotalTreatments);
router.get("/dose-counts",getDoseCounts);
router.get("/animals-by-dose",getAnimalByDose);
router.get("/dose-details",getAnimalDoseDetails);
router.post("/dose-given",markDoseGiven);

module.exports = router;