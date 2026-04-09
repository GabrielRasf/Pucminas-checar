const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Checar - Gestão de Veículos',
      version: '1.0.0',
      description: 'Documentação da API para checklist de manutenção de veículos',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor Local',
      },
    ],
  },
  apis: [path.resolve(__dirname, 'routes.js')],
};

module.exports = swaggerJsdoc(options);