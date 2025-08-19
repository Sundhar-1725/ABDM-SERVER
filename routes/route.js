const express = require('express');
const api = express();
const sessionRouter = require('./router/sessionrouter');
const aadharEnrolmentRouter = require('./router/aadharenrolmentrouter');

api.use('/Session',sessionRouter)
api.use('/EnrolmentViaAadhar',aadharEnrolmentRouter);
module.exports = api