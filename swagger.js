const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: "HIKE HEALTHGS ABDM APIs",
    description: "Version 1.0"
  },
  host: "localhost:3000",            
  basePath: "/",                     
  schemes: ["http"],                 
  consumes: ["application/json"],    
  produces: ["application/json"]     
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./app.js"]; 

swaggerAutogen(outputFile, endpointsFiles, doc);