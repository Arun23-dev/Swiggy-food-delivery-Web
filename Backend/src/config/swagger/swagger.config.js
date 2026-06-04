const swaggerJsDoc = require("swagger-jsdoc");
const options = require("./swagger.options");
const path = require("path");

module.exports = swaggerJsDoc(options);