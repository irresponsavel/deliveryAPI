const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const agendamentos = require('../models/agendamento');
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
        const agendamento = await agendamentos.find({});
            return res.send(agendamento);
    }
    catch (err) {
        return res.status(500).send({ error: 'Erro na busca do Agendamento!' });
    }
});

router.post('/create', async (req, res) => {
    const { data, valor, carga, descarga, notaFiscal, motorista } = req.body;

    if ( !data || !valor || !carga || !descarga || !notaFiscal || !motorista )
        return res.send({ error: 'Verifique se todos os campos obrigatórios foram informados!' });
    try {
        if (await agendamentos.findOne({ notaFiscal }))
            return res.send({ error: 'Agendamento já cadastrado!' });
        
        const agendamento = await agendamentos.create(req.body);

    }
    catch (err) {
        return res.send({ error: `Erro ao gravar o Agendamento: ${err}`})
    }
});

router.put('/update/:id', auth, async (req, res) => {
    const { data, valor, carga, descarga, notaFiscal, motorista } = req.body;

    if ( !data || !valor || !carga || !descarga || !notaFiscal || !motorista )
        return res.send({ error: 'Verifique se todos os campos obrigatórios foram informados!' });
    try {
        if (await agendamentos.findOne({ notaFiscal }))
            return res.send({ error: 'Agendamento já cadastrado! '});
        
        const agendamento = await agendamentos.findByIdAndUpdate(req.params.id, req.body);
        const agendamentoAtt = await agendamentos.findById(req.params.id);

            return res.status(201).send({ agendamentoAtt });
    }
    catch (err) {
            return res.status(201).send({ error: `Erro ao atualizar o agendamento: ${err}`})
    }
});

router.delete('/delete/:id', auth, async (req, res) => {
    try {
        await agendamentos.findByIdAndDelete(req.params.id);
            return res.send({ error: 'Agendamento removido com sucesso!' });
    }
    catch (err) {
            return res.send({ error: 'Erro ao remover Agendamento! '});
    }
});


module.exports = router;