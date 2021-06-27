const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const agendamentoSchema = new Schema( {

    data: { type: String, required: true},
    valor: { type: String, required: false, unique: false},
    carga: { type: String, required: false},
    descarga: { type: String, required: false},
    notaFiscal: { type: String, required: true, unique: true},
    motorista: { type: String, required: true},

});

module.exports = mongoose.model('Agendamento', agendamentoSchema);