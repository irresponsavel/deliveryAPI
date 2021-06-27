const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const transportadoras = require('../models/transportadora');
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
        return res.send({ message: 'Login Inválido!' });

    usuarios.findOne({ login }, (err, data) => {
        if (err)
            return res.send({ message: 'Erro ao buscar Login!' });
        if (!data)
            return res.send({ message: 'Login não encontrado!' });

        bcrypt.compare(senha, data.senha, (err, same) => {
            if (!same)
                return res.send({ message: 'Erro na Autenticação!' });
            
            data.senha = undefined;
            return res.send({ data, token: createUsuarioToken(data.id)});
        });
    }).select('+senha');
});

router.get('/', async (req, res) => {
    try {
        const transportadora = await transportadoras.find({});
            return res.send(transportadora);
    }
    catch (err) {
        return res.status(500).send({ message: 'Erro na busca da Transportadora!' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const transportadora = await transportadoras.findById( req.params.id )
            return res.send(transportadora);
    }
    catch (err) {
        return res.status(500).send({ message: 'Erro na busca da Transportadora!' });
    }
});

router.post('/create', async (req, res) => {
    const { nome, regiao, estado, cidade, cnpj } = req.body;

    if ( !nome || !estado || !cidade || !cnpj )
        return res.send({ message: 'Verifique se todos os campos obrigatórios foram informados!' });
    try {
        if (await transportadoras.findOne({ cnpj }))
            return res.send({ message: 'Transportadora já cadastrada!' });
        
        const transportadora = await transportadoras.create(req.body);
        return res.status(201).send({ message: `Transportadora Cadastrada`})

    }
    catch (err) {
        return res.send({ message: `Erro ao gravar a Transportadora: ${err}`})
    }

});

router.put('/update/:id', auth, async (req, res) => {
    const { nome, regiao, estado, cidade, cnpj } = req.body;

    if ( !nome || !estado || !cidade || !cnpj )
        return res.send({ message: 'Verifique se todos os campos obrigatórios foram informados!' });
    try {
        if (await transportadoras.findOne({ cnpj }))
            return res.send({ message: 'Transportadora já cadastrada! '});
        
        const transportadora = await transportadoras.findByIdAndUpdate(req.params.id, req.body);
        const transportadoraAtt = await transportadoras.findById(req.params.id);

            return res.status(201).send({ transportadoraAtt });
    }
    catch (err) {
            return res.status(201).send({ message: `Erro ao atualizar a transportadora: ${err}`})
    }
});

router.delete('/delete/:id', auth, async (req, res) => {
    try {
        await transportadoras.findByIdAndDelete(req.params.id);
            return res.send({ message: 'Transportadora removido com sucesso!' });
    }
    catch (err) {
            return res.send({ message: 'Erro ao remover Transportadora! '});
    }
});


module.exports = router;