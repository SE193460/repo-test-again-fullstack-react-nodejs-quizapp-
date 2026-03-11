const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Quiz API",
            version: "1.0.0",
            description: "API documentation for Quiz App"
        },
        servers: [
            {
                url: "https://react-nodejs-fullstack-quiz-app.onrender.com"
            }
        ]
    },
    apis: ["./routes/*.js"]
};

const specs = swaggerJsdoc(options);

module.exports = specs;