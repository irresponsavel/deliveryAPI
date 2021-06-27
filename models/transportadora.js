const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transportadoraSchema = new Schema( {

    nome: { type: String, unique: false, required: true},
    regiao: { type: String, unique: false, required: false},
    estado: { type: String, unique: false, required: true},
    cidade: { type: String, unique: false, required: true},
    cnpj: { type: String, unique: true, required: true}

});

module.exports = mongoose.model('Transportadora', transportadoraSchema);