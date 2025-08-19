const express = require('express');
const downloadABHACardWithMobileNumberController = require('../../controller/healthid/downloadcard/mobilenumber');
const router = express.Router();

router.post('/search', downloadABHACardWithMobileNumberController.searchCardByMobileNumber);
router.post('/sendOtp', downloadABHACardWithMobileNumberController.sendOtpByMobileNumber);
router.post('/verifyOtp', downloadABHACardWithMobileNumberController.verifyOtpByMobileNumber);

module.exports = router;