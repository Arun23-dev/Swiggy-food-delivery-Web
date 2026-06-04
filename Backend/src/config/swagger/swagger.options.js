const schemas = require('./swagger.schemas')
const path = require("path");

module.exports = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Swiggy Backend API",
            version: "1.0.0",
            description: "Production-ready API documentation",
        },
        tags: [                          // 👈 add this here
            { name: "Health" },
            { name: "Restaurant" },
            { name: "User" },
            { name: "Cart" },
            { name: "Order" },
            { name: "Payment" },

        ],
        servers: [
            {
                url: process.env.BASE_URL || "http://localhost:3000",
            },
        ],
        components: {
            schemas: schemas,
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        }
    },
    apis: [
        path.join(process.cwd(), 'src/docs/*.js'),    // 👈 changed
        path.join(process.cwd(), 'src/routes/*.js'),  // 👈 changed
        path.join(process.cwd(), 'index.js'),         // 👈 changed
    ]
};