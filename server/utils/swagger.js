const swaggerUi = require('swagger-ui-express');
const swaggereJsdoc = require('swagger-jsdoc');

const options = {
    swaggerDefinition: {
        info: {
            title: 'Test API',
            version: '1.0.0',
            description: 'Test API with express',
        },
        servers:[
            {
                url:"http://localhost:8000"
            }
        ]
        // host: 'http://localhost:8000',
        // basePath: '/'
    },
    apis: ['./routes/admin/*.js','./routes/api/*.js',]
};

const specs = swaggereJsdoc(options);

module.exports = {
    swaggerUi,
    specs
};