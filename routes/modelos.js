const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const modelos = require('../models/modelo');
const config = require('../config/config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const createUsuarioToken = (userId) => {
    return jwt.sign({
        id: userId},
        config.jwtPass,
        { expiresIn: config.jwtExpires });
};

router.post('/auth', (req, res) => {
    
    const { login, senha} = req.body;

    if (!login || !senha) 
        return res.send({ error: 'Login Inválido!' });

    usuarios.findOne({ login }, (err, data) => {
        if (err)
            return res.send({ error: 'Erro ao buscar Login!' });
        if (!data)
            return res.send({ error: 'Login não encontrado!' });

        bcrypt.compare(senha, data.senha, (err, same) => {
            if (!same)
                return res.send({ error: 'Erro na Autenticação!' });
            
            data.senha = undefined;
            return res.send({ data, token: createUsuarioToken(data.id)});
        });
    }).select('+senha');
});

router.get('/', async (req, res) => {
    try {
        const modelo = await modelos.find({});
            return res.send(modelo);
    }
    catch (err) {
        return res.status(500).send({ error: 'Erro na busca do Modelo!' });
    }
});

router.post('/create', async (req, res) => {
    const { veiculo, placa, tipo } = req.body;

    if ( !veiculo || !placa || !tipo )
        return res.send({ error: 'Verifique se todos os campos obrigatórios foram informados!' });
    try {
        if (await modelos.findOne({ placa }))
            return res.send({ error: 'Modelo já cadastrado!' });
        
        const modelo = await modelos.create(req.body);

    }
    catch (err) {
        return res.send({ error: `Erro ao gravar o Modelo: ${err}`})
    }
});

router.put('/update/:id', auth, async (req, res) => {
    const { veiculo, placa, tipo } = req.body;

    if ( !veiculo || !placa || !tipo )
        return res.send({ error: 'Verifique se todos os campos obrigatórios foram informados!' });
    try {
        if (await modelos.findOne({ placa }))
            return res.send({ error: 'Modelo já cadastrado! '});
        
        const modelo = await modelos.findByIdAndUpdate(req.params.id, req.body);
        const modeloAtt = await modelos.findById(req.params.id);

            return res.status(201).send({ modeloAtt });
    }
    catch (err) {
            return res.status(201).send({ error: `Erro ao atualizar o Modelo: ${err}`})
    }
});

router.delete('/delete/:id', auth, async (req, res) => {
    try {
        await modelos.findByIdAndDelete(req.params.id);
            return res.send({ error: 'Modelo removido com sucesso!' });
    }
    catch (err) {
            return res.send({ error: 'Erro ao remover Modelo! '});
    }
});


module.exports = router;