const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: "HIKE HEALTHGS ABDM APIs",
    description: "Version 1.0"
  },
  host: "api.fifpclub.com",            
  basePath: "/qa",                     
  schemes: ["https"],                 
  consumes: ["application/json"],    
  produces: ["application/json"]     
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./app.js"]; 

swaggerAutogen(outputFile, endpointsFiles, doc);