const express = require('express');
const router = express.Router();

const {createAccount,tologin} = require("../controllers/user/createAccount");
const {addTreatment} = require("../controllers/treatments/addTreatment");
const {getTreatmentHistory} = require("../controllers/treatments/treatmentHistory");
const {getTreatmentDetails} =require("../controllers/treatments/viewTreatment");
const {getVetMonthlyStats} = require("../controllers/treatments/countTreatment");

router.post("/signup",createAccount);
router.post("/signin",tologin);


//vet
router.post("/add-treatment",addTreatment);
router.get("/view-history",getTreatmentHistory);
router.get("/view-treatment-details",getTreatmentDetails);
router.get("/monthly-stats",getVetMonthlyStats);


module.exports = router;