const common = require('../../service/common');
const axios = require('axios');
const uuid = require('uuid');
exports.createSession = async (req, res) => {
    // #swagger.tags = ['Session-Api']
    try {
        const requestId = uuid.v4();
        const timestamp = new Date().toISOString();
        const response = await axios.post(common.api.sessionApi,
            {
                clientId: common.service.client_id,
                clientSecret: common.service.client_secret,
                grantType: "client_credentials",
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "REQUEST-ID": requestId,
                    "TIMESTAMP": timestamp,
                    "X-CM-ID": "sbx",
                },
            })
        const sessionData = response.data
        return res.status(200).json({
            status: "true",
            message: "Session created successfully",
            data: sessionData
        });
    } catch (error) {
        return res.status(500).json({
            status: "false",
            message: "Failed to create session",
            error: error.message || "Internal Server Error"
        })
    }
}