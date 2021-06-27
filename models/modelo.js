const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const modeloSchema = new Schema( {

    veiculo: { type: String, required: false},
    placa: { type: String, required: true, unique: true},
    tipo: { type: String, required: false},

});

module.exports = mongoose.model('Modelo', modeloSchema);