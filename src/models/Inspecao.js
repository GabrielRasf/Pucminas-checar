const mongoose = require('mongoose');

const InspecaoSchema = new mongoose.Schema({
    // RF-011: Busca por placa
    placa: { 
        type: String, 
        required: true, 
        uppercase: true, 
        trim: true 
    },

    dataInspecao: { 
        type: Date, 
        default: Date.now 
    },

    // RF-005: Fotos organizadas por posição
    // Em vez de um array genérico, usamos um objeto com campos fixos
    fotos: {
        frente: { type: String, required: true },
        traseira: { type: String, required: true },
        lateralEsquerda: { type: String, required: true },
        lateralDireita: { type: String, required: true },
        topo: { type: String, required: true }
    }
});

InspecaoSchema.index({ placa: 1 });

module.exports = mongoose.model('Inspecao', InspecaoSchema);