const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser'); 
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json'); 
require('dotenv').config();
const PORT = 3000;
const app = express();  
app.use(cors());
app.use(bodyParser.json()); 
const allRoutes = require('./routes/route');
app.use('/qa/docs',swaggerUi.serve,swaggerUi.setup(swaggerDocument));
app.get('/qa', (req, res) => {
    res.send('ABDM BACKEND SERVER IS RUNNING');
});
app.use('/qa/api/ABDM',allRoutes);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});