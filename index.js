const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config/config');

const app = express();

const options = {
    poolSize: 5,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
};

mongoose.connect('mongodb+srv://victor:123@cluster0.2cfgi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',options);

mongoose.set('useCreateIndex',true);

mongoose.connection.on('connected', () => {
    console.log('Aplicação conectada ao banco de dados!');
});

mongoose.connection.on('error', (err) => {
    console.log(`Erro na conexão com o banco de dados:  ${err}`);
});

mongoose.connection.on('disconnected', () => {
    console.log('Aplicação desconectada do banco de dados!');
});

const { urlencoded } = require('body-parser');
app.use(urlencoded({ extended: false }));
app.use(bodyParser.json());

const usuarioRoutes = require('./routes/usuarios');
const transportadoraRoutes = require('./routes/transportadoras');
const modeloRoutes = require('./routes/modelos');
const agendamentoRoutes = require('./routes/agendamentos');

app.use('/usuarios', usuarioRoutes);
app.use('/transportadoras', transportadoraRoutes);
app.use('/modelos', modeloRoutes);
app.use('/agendamentos', agendamentoRoutes);

app.listen(process.env.PORT || 5000);

module.exports = app;