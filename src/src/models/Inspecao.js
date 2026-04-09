const mongoose = require('mongoose');

const InspecaoSchema = new mongoose.Schema({
    dataInspecao: { type: Date, default: Date.now },
    fotos: [String], // Array com os caminhos das imagens (ex: uploads/123.jpg)
    descricaoLivre: String // Caso o funcionário queira anotar algo
});

module.exports = mongoose.model('Inspecao', InspecaoSchema);

