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


exports.verifyOtp = async (req, res) => {
    // #swagger.tags = ['HealthID-Aadhar-Enrolment']
    const { txnId, otp, mobile, token } = req.body;

    if (!otp || !/^\d{6}$/.test(otp)) {
        return res.status(201).json({
            status: "false",
            message: "Invalid OTP. It should be 6 digits long."
        });
    }
    if (!txnId) {
        return res.status(201).json({
            status: "false",
            message: "Invalid transaction ID format."
        });
    }
    if (!mobile || !/^\d{10}$/.test(mobile)) {
        return res.status(201).json({
            status: "false",
            message: "Invalid mobile number. It should be 10 digits long."
        });
    }
    if (!token) {
        return res.status(201).json({
            status: "false",
            message: "Missing required fields: token"
        });
    }
    try {
        const requestId = uuid.v4();
        const timestamp = new Date().toISOString();
        const encryptedOTP = await callEncryption(otp, common.service.publicKey);
        if (!encryptedOTP) {
            return res.status(500).json({
                status: "false",
                message: "Failed to encrypt OTP Value"
            });
        }
        const response = await axios.post(common.api.enrolmentViaAadhartOtpVerifyApi,
            {
                "authData": {
                    "authMethods": [
                        "otp"
                    ],
                    "otp": {
                        "txnId": txnId,
                        "otpValue": encryptedOTP,
                        "mobile": mobile
                    }
                },
                "consent": {
                    "code": "abha-enrollment",
                    "version": "1.4"
                }
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    "REQUEST-ID": requestId,
                    "TIMESTAMP": timestamp,
                }
            });
        const existAccount = response.data?.message?.includes("This account already exist");
        if (existAccount) {
            return res.status(200).json({
                status: "true",
                message: "This account already exists",
                data: response.data
            });
        }
        return res.status(200).json({
            status: "true",
            message: "OTP verified successfully",
            data: response.data
        });

    } catch (error) {
        if (error.response && error.response.status === 400) {
            return res.status(201).json({
                status: "false",
                message: "Failed to verify OTP",
                data: error.response ? error.response.data : null
            });
        }
        if (error.response && error.response.status === 422) {
            return res.status(201).json({
                status: "false",
                message: "Failed to verify OTP",
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
            message: "Failed to verify OTP",
            error: error.message,
            data: error.response ? error.response.data : null
        });
    }
}

