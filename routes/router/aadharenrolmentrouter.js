const express = require('express');
const enrolmentAadharController = require('../../controller/healthid/aadhar/aadhar');
const router = express.Router();

router.post('/sendOTP', enrolmentAadharController.sendOtp);
router.post('/verifyOTP', enrolmentAadharController.verifyOtp);

module.exports = router;