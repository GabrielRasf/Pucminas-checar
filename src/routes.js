const express = require('express');
const router = express.Router();
const upload = require('./config/multer');
const Inspecao = require('./models/Inspecao');

/**
 * @swagger
 * /inspecao/upload:
 *   post:
 *     summary: Realizar inspeção com fotos obrigatórias (RF-005)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               placa:
 *                 type: string
 *                 example: ABC1234
 *               frente:
 *                 type: string
 *                 format: binary
 *               traseira:
 *                 type: string
 *                 format: binary
 *               lateralEsquerda:
 *                 type: string
 *                 format: binary
 *               lateralDireita:
 *                 type: string
 *                 format: binary
 *               topo:
 *                 type: string
 *                 format: binary
 */
router.post('/inspecao/upload', upload.fields([
    { name: 'frente', maxCount: 1 },
    { name: 'traseira', maxCount: 1 },
    { name: 'lateralEsquerda', maxCount: 1 },
    { name: 'lateralDireita', maxCount: 1 },
    { name: 'topo', maxCount: 1 }
]), async (req, res) => {
    try {
        console.log("--- Nova tentativa de Upload Estruturado ---");
        
        const { placa } = req.body;

        // Validação adicional da placa
        if (!placa || placa.trim() === '') {
            return res.status(400).json({ 
                erro: "Placa obrigatória",
                mensagem: "A placa do veículo é obrigatória." 
            });
        }

        // Mapeia os caminhos das fotos usando Optional Chaining
        const fotosPaths = {
            frente: req.files?.['frente']?.[0]?.path,
            traseira: req.files?.['traseira']?.[0]?.path,
            lateralEsquerda: req.files?.['lateralEsquerda']?.[0]?.path,
            lateralDireita: req.files?.['lateralDireita']?.[0]?.path,
            topo: req.files?.['topo']?.[0]?.path
        };

        const novaInspecao = new Inspecao({
            placa: placa.toUpperCase(),
            fotos: fotosPaths
        });

        // O save() vai disparar a validação do Model (onde estão os 'required: true')
        await novaInspecao.save();
        
        console.log("Sucesso: Inspeção salva com todas as fotos!");
        res.status(201).json({
            mensagem: "Inspeção realizada com sucesso!",
            dados: novaInspecao
        });

    } catch (error) {
        console.error("ERRO NO BACKEND:", error.message);

        // Tratamento amigável para erro de campos obrigatórios (Mongoose ValidationError)
        if (error.name === 'ValidationError') {
            const camposFaltantes = Object.keys(error.errors).map(field => field);
            return res.status(400).json({ 
                erro: "Checklist Incompleto",
                mensagem: "Você esqueceu de preencher a placa ou tirar alguma das fotos obrigatórias.",
                campos_pendentes: camposFaltantes
            });
        }

        // Erro genérico para outros problemas (ex: conexão com banco)
        res.status(500).json({ 
            erro: "Erro interno no servidor.",
            detalhe: error.message 
        });
    }
});

/**
 * @swagger
 * /inspecoes/historico/{placa}:
 *   get:
 *     summary: Buscar histórico de inspeções por placa (RF-011)
 *     parameters:
 *       - in: path
 *         name: placa
 *         required: true
 *         schema:
 *           type: string
 *         description: Placa do veículo
 *     responses:
 *       200:
 *         description: Lista de inspeções encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: Nenhuma inspeção encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/inspecoes/historico/:placa', async (req, res) => {
    try {
        const { placa } = req.params;
        
        if (!placa || placa.trim() === '') {
            return res.status(400).json({ 
                erro: "Placa obrigatória",
                mensagem: "A placa do veículo é obrigatória." 
            });
        }

        const historico = await Inspecao.find({ 
            placa: placa.toUpperCase() 
        }).sort({ dataInspecao: -1 });

        if (historico.length === 0) {
            return res.status(404).json({ 
                mensagem: `Nenhuma inspeção encontrada para a placa ${placa.toUpperCase()}.` 
            });
        }

        res.status(200).json(historico);
    } catch (error) {
        console.error("Erro ao buscar histórico:", error.message);
        res.status(500).json({ 
            erro: "Erro ao buscar histórico.", 
            detalhe: error.message 
        });
    }
});

module.exports = router;