require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const inspecaoRoutes = require('./routes'); 

const app = express();

// Middlewares
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- CONFIGURAÇÃO DO SWAGGER ---
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Checar',
            version: '1.0.0',
        },
        servers: [{ url: 'http://localhost:3000' }],
    },

    apis: [path.resolve(__dirname, 'routes.js')], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Rota da Documentação
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// --- CONEXÃO BANCO DE DADOS ---
const dbURI = process.env.MONGODB_URI;

mongoose.connect(dbURI)
    .then(() => console.log("Conectado ao MongoDB Atlas"))
    .catch(err => console.error("Erro ao conectar ao MongoDB Atlas:", err));

// Rotas da API
app.use(inspecaoRoutes);

// --- INICIALIZAÇÃO ---
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Documentação disponível em http://localhost:${PORT}/api-docs`);
});