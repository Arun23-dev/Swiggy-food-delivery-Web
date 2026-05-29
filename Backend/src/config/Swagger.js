const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Backend Swiggy Project API",
            version: "1.0.0",
            description: "API documentation for Swiggy backend project",
        },

        servers: [
            {
                url: `http://localhost:${process.env.PORT || 3000}`,
            },
        ],
    },

    apis: ["./index.js", "./src/routes/*.js"],
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = { swaggerUi, swaggerSpec };