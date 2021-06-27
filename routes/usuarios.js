const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');
const config = require('../config/config');
const usuarios = require('../models/usuario');

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
        const usuario = await usuario.find({});
            return res.send(usuario);
    }
    catch (err) {
        return res.status(500).send({ error: 'Erro na busca dos Usuários!' });
    }
});


router.post('/create', async (req, res) => {
    const { nome, sobrenome, nascimento, login, senha,  dica_de_senha, cidade, estado} = req.body;

    if (!nome || !sobrenome || !nascimento || !login || !senha)
        return res.send({ error: 'Verifique se todos os campos obrigatórios foram informados!' });
    try {
        if (await usuarios.findOne({ login } ))
            return res.send({ error: 'Login já cadastrado!' });
        
        const usuario = await usuarios.create(req.body);

        usuario.senha = undefined;
        return res.status(201).send({ usuario, token: createUsuarioToken(usuario.id) })
    }
    catch (err) {
        return res.send({ error: `Erro ao gravar o Usuário: ${err}`})
    }
});

router.put('/update/:id', auth, async (req, res) => {
    const { nome, sobrenome, nascimento, login, senha,  dica_de_senha, cidade, estado} = req.body;

    if (!nome || !sobrenome || !nascimento || !login || !senha)
        return res.send({ error: 'Verifique se todos os campos obrigatórios foram informados!' });
    try {
        if (await usuarios.findOne({ login }))
            return res.send({ error: 'Login já cadastrado! '});
        
        const usuario = await usuarios.findByIdAndUpdate(req.params.id, req.body);
        const usuarioChanged = await usuarios.findById(req.params.id);

        usuarioChanged.senha = undefined;
            return res.status(201).send({ usuarioChanged });
    }
    catch (err) {
            return res.status(201).send({ error: `Erro ao atualizar o Usuário: ${err}`})
    }
});

router.delete('/delete/:id', auth, async (req, res) => {
    try {
        await usuarios.findByIdAndDelete(req.params.id);
            return res.send({ error: 'Usuário removido com sucesso!' });
    }
    catch (err) {
            return res.send({ error: 'Erro ao remover Usuário! '});
    }
});

module.exports = router;