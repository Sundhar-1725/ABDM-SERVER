const axios = require('axios');
const uuid = require('uuid');
const common = require('../../../service/common');
const callEncryption = require('../../../service/encryption/encryption');
const e = require('express');


exports.searchCardByMobileNumber = async (req, res) => {
    // #swagger.tags = ['HealthCard-Download-Via-MobileNumber']
    const { mobile, token } = req.body;
    try {
        if (mobile && !/^\d{10}$/.test(mobile)) {
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
        const requestId = uuid.v4();
        const timestamp = new Date().toISOString();
        const encryptedMobile = await callEncryption(mobile, common.service.publicKey);
        if (!encryptedMobile) {
            return res.status(500).json({
                status: "false",
                message: "Failed to encrypt mobile number"
            });
        }
        const response = await axios.post(common.api.downloadABHACardViaMobileNumberSearchApi,
            {
                "scope": ["search-abha"],
                "mobile": encryptedMobile,
            }, {
            headers: {
                Authorization: `Bearer ${token}`,
                "REQUEST-ID": requestId,
                "TIMESTAMP": timestamp,
                "BENEFIT_NAME": "abc",
            }
        })
        return res.status(200).json({
            status: "true",
            message: "Card search successful",
            data: response.data
        });
    } catch (error) {
        if (error.response && error.response.status === 400) {
            return res.status(201).json({
                status: "false",
                message: "Failed to search card",
                data: error.response ? error.response.data : null
            });
        }
        if (error.response && error.response.status === 404) {
            return res.status(201).json({
                status: "false",
                message: "User not found or card not available",
                data: error.response ? error.response.data : null
            });
        }
        if(error.response && error.response.status === 401) {
            return res.status(401).json({   
                status: "false",
                message: "Unauthorized access. Please check your token.",
                data: error.response ? error.response.data : null
            });         
        }
        return res.status(500).json({
            status: "false",
            message: "Internal server error",
            data: error.message
        });
    }
}


exports.sendOtpByMobileNumber = async (req, res) => {
    // #swagger.tags = ['HealthCard-Download-Via-MobileNumber']
    const { loginId, txnId, token } = req.body;
    try {
        if (!loginId) {
            return res.status(201).json({
                status: "false",
                message: "LoginId Should Be Need"
            });
        }
        if (!txnId) {
            return res.status(201).json({
                status: "false",
                message: "Invalid Transaction Id"
            });
        }
        if (!token) {
            return res.status(201).json({
                status: "false",
                message: "Missing required fields: token"
            });
        }
        const requestId = uuid.v4();
        const timestamp = new Date().toISOString();
        const encryptedIndex = await callEncryption(loginId, common.service.publicKey);
        if (!encryptedIndex) {
            return res.status(500).json({
                status: "false",
                message: "Failed to encrypt index"
            });
        }
        const response = await axios.post(common.api.downloadABHACardViaMobileNumberSendOtpApi,
            {
                "scope": ["abha-login", "search-abha", "mobile-verify"],
                "loginHint": "index",
                "loginId": encryptedIndex,
                "otpSystem": "abdm",
                "txnId": txnId
            }, {
            headers: {
                Authorization: `Bearer ${token}`,
                "REQUEST-ID": requestId,
                "TIMESTAMP": timestamp,
                "BENEFIT_NAME": "abc",
                "Content-Type": "application/json"
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
        return res.status(500).json({
            status: "false",
            message: "Internal server error",
            data: error.message
        });
    }
}


exports.verifyOtpByMobileNumber = async (req, res) => {
    // #swagger.tags = ['HealthCard-Download-Via-MobileNumber']
    const { txnId, otp, token } = req.body;
    try {
        if (otp && !/^\d{6}$/.test(otp)) {
            return res.status(201).json({
                status: "false",
                message: "Invalid OTP. It should be 6 digits long."
            });
        }
        if (!txnId) {
            return res.status(201).json({
                status: "false",
                message: "Invalid Transaction Id"
            });
        }
        if (!token) {
            return res.status(201).json({
                status: "false",
                message: "Missing required fields: token"
            });
        }
        const requestId = uuid.v4();
        const timestamp = new Date().toISOString();
        const encryptedOtp = await callEncryption(otp, common.service.publicKey);
        if (!encryptedOtp) {
            return res.status(500).json({
                status: "false",
                message: "Failed to encrypt OTP"
            });
        }
        const response = await axios.post(common.api.downloadABHACardViaMobileNumberVerifyOtpApi,
            {
                "scope": ["abha-login", "mobile-verify"],
                "authData": {
                    "authMethods": ["otp"],
                    "otp": {
                        "txnId": txnId,
                        "otpValue": encryptedOtp
                    }
                }
            }, {
            headers: {
                Authorization: `Bearer ${token}`,
                "REQUEST-ID": requestId,
                "TIMESTAMP": timestamp,
                "BENEFIT_NAME": "abc",
                "Content-Type": "application/json"
            }
        });
        return res.status(200).json({
            status: "true",
            message: "OTP verification successful",
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
        if (error.response && error.response.status === 401) {
            return res.status(401).json({
                status: "false",
                message: "Unauthorized access. Please check your token.",
                data: error.response ? error.response.data : null
            });
        }
        return res.status(500).json({
            status: "false",
            message: "Internal server error",
            data: error.message
        });
    }
}

exports.fetchABHACard = async(req,res)=>{
    // #swagger.tags = ['HealthCard-Download-Via-MobileNumber']
    const{token,x_token}=req.body;
    try {
        if (!token) {
            return res.status(201).json({
                status: "false",
                message: "Missing required fields: token"
            });
        }
        if(!x_token) {
            return res.status(201).json({
                status: "false",
                message: "Missing required fields: x_token"
            });
        }
        const requestId = uuid.v4();
        const timestamp = new Date().toISOString(); 
        const response = await axios.post(common.api.fetchABHACard,
            {}, {
            headers: {
                Authorization: `Bearer ${token}`,
                "X-Token": x_token,
                "REQUEST-ID": requestId,
                "TIMESTAMP": timestamp,
            }
        }); 
        return res.status(200).json({
            status: "true",
            message: "ABHA Card Fetched successfully",
            data: response.data
        });
        
    } catch (error) {
        if(error.response && error.response.status === 400) {
            return res.status(201).json({
                status: "false",
                message: "Invalid X-Token",
                data: error.response ? error.response.data : null
            });
        }
        if(error.response && error.response.status === 401) {
            return res.status(401).json({
                status: "false",
                message: "Unauthorized access. Please check your token.",
                data: error.response ? error.response.data : null
            });
        }
        return res.status(500).json({
            status: "false",
            message: "Internal server error",
            data: error.message
        });
    }
}