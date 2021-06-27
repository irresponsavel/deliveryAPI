const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const usuarioSchema = new Schema( {

    nome: { type: String, required: true, unique: false},
    sobrenome: { type: String, required: true},
    nascimento: { type: String, required: true},
    login: { type: String, required: true, unique: true},
    senha: { type: String, required: true},
    cidade: { type: String},
    estado: { type: String}

});

usuarioSchema.pre('save', async function (next) {
    let usuario = this;
    if (!usuario.isModified('senha'))
        return next();
    usuario.senha = await bcrypt.hash(usuario.senha, 10);
        return next();
});

module.exports = mongoose.model('Usuario', usuarioSchema);