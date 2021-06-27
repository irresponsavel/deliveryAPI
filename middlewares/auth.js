const jwt = require('jsonwebtoken');
const config = require('../config/config');

const auth = (req, res, next) => {
    
    const tokenHeader = req.headers.auth;
    
    if (!tokenHeader)
        return res.send({ error : ' Token não recebido!' });

        jwt.verify(
            tokenHeader,
            config.jwtPass,
            (err, decoded) => {
                if (err)
                    return res.send ({ error: 'Token Inválido! '});
            
            res.locals.authData = decoded;
            return next();
        }
    );
};

module.exports = auth;