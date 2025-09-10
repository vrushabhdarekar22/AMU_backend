const express = require('express');
const router = express.Router();

const {createAccount,tologin} = require("../controllers/user/createAccount")
const {addTreatment} = require("../controllers/treatments/addTreatment");

router.post("/signup",createAccount);
router.post("/signin",tologin);

router.post("/add-treatment",addTreatment);


module.exports = router;