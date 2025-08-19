const express = require('express');
const sessionController = require('../../controller/session/session');
const router = express.Router();

router.post('/create', sessionController.createSession);


module.exports = router;