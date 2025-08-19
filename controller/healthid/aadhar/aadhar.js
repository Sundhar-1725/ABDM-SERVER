const axios = require('axios');
const uuid = require('uuid');
const common = require('../../../service/common')
const callEncryption = require('../../../service/encryption/encryption');

exports.sendOtp = async (req, res) => {
    // #swagger.tags = ['HealthID-Aadhar-Enrolment']
    const { aadhar, token } = req.body;

    if (!aadhar || !/^\d{12}$/.test(aadhar)) {
        return res.status(201).json({
            status: "false",
            message: "Invalid Aadhaar number. It should be 12 digits long."
        });
    }
    if (!token) {
        return res.status(201).json({
            status: "false",
            message: "Missing required fields: token"
        });
    }
    const encryptedAadhar = await callEncryption(aadhar, common.service.publicKey);
    if (!encryptedAadhar) {
        return res.status(500).json({
            status: "false",
            message: "Failed to encrypt Aadhaar number"
        });
    }
    try {
        const requestId = uuid.v4();
        const timestamp = new Date().toISOString();
        const response = await axios.post(common.api.enrolmentViaAadhartOtpApi,
            {
                txnId: "",
                scope: ["abha-enrol"],
                loginHint: "aadhaar",
                loginId: encryptedAadhar,
                otpSystem: "aadhaar",
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    "REQUEST-ID": requestId,
                    "TIMESTAMP": timestamp,
                }
            });

        return res.status(200).json({
            status: "true",
            message: "OTP sent successfully",
            data: response.data
        });

    } catch (error) {
        if (error.response && error.response.status === 400) {
            return res.status(201).json({
                status: "false",
                message: "Failed to send OTP",
                data: error.response ? error.response.data : null
            });
        }
        if (error.response && error.response.status === 401) {
            return res.status(401).json({
                status: "false",
                message: "Unauthorized access",
                data: error.response ? error.response.data : null
            });
        }
        return res.status(500).json({
            status: "false",
            message: "Failed to send OTP",
            error: error.message,
            data: error.response ? error.response.data : null
        });
    }
}