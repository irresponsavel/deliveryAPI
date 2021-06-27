const env = process.env.NODE_ENV || 'dev';

const config = () => {
    switch (env) {
        case 'dev' :
            return {
                dbString : 'mongodb+srv://Dudu:123@cluster0.gw2oq.mongodb.net/deliverydb?retryWrites=true&w=majority',
                jwtPass : 'brozo',
                jwtExpires : '1d'
            }
            case 'hml' :
            return {
                dbString : 'mongodb+srv://Dudu:123@cluster0.gw2oq.mongodb.net/deliverydb?retryWrites=true&w=majority',
                jwtPass : 'brozo',
                jwtExpires : '1d'
            }
            case 'PRODUCTION' :
            return {
                dbString : 'mongodb+srv://Dudu:123@cluster0.gw2oq.mongodb.net/deliverydb?retryWrites=true&w=majority',
                jwtPass : 'brozo',
                jwtExpires : '1d'
            }
    }
};

console.log(`Iniciando a API em ambiente ${env.toUpperCase()}`);

module.exports = config();