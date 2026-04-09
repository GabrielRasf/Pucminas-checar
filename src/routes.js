const express = require('express');
const router = express.Router();
const upload = require('./config/multer');
const Inspecao = require('./models/Inspecao');

/**
 * @swagger
 * /inspecao/upload:
 *   post:
 *     summary: Upload de fotos da inspeção
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fotos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               descricao:
 *                 type: string
 */
router.post('/inspecao/upload', upload.array('fotos', 10), async (req, res) => {
    try {
        console.log("--- Nova tentativa de Upload ---");
        
        // VALIDAÇÃO DE UPLOAD VAZIO
        if (!req.files || req.files.length === 0) {
            console.log("ERRO: Nenhum arquivo enviado");
            return res.status(400).json({ 
                erro: "Upload vazio",
                mensagem: "Nenhuma foto foi enviada. Envie pelo menos uma foto."
            });
        }

        const caminhos = req.files.map(file => file.path);

        const novaInspecao = new Inspecao({
            fotos: caminhos,
            descricaoLivre: req.body.descricao || "Inspeção realizada via App"
        });

        await novaInspecao.save();
        console.log("Sucesso: Registro salvo no MongoDB Atlas!");

        res.status(201).json({
            mensagem: "Fotos enviadas e salvas com sucesso!",
            dados: novaInspecao
        });

    } catch (error) {
        console.error("ERRO NO BACKEND:", error);
        res.status(500).json({ 
            erro: "Falha ao processar upload.",
            detalhe_do_erro: error.message 
        });
    }
});

module.exports = router;