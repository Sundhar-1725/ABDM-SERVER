const express = require('express');
const api = express();
const sessionRouter = require('./router/sessionrouter');
const aadharEnrolmentRouter = require('./router/aadharenrolmentrouter');
const downloadABHACARDRouter = require('./router/downloadabhacardrouter');

api.use('/Session',sessionRouter)
api.use('/EnrolmentViaAadhar',aadharEnrolmentRouter);
api.use('/Health-Id/DownloadABHACardViaMobileNumber',downloadABHACARDRouter)
module.exports = api