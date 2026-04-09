const express = require('express');
const swaggerUi = require('swagger-ui-express');
const routes = require('./routes');
const specs = require('./swagger');

const app = express();

app.use('/api', routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));