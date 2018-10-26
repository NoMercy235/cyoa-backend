let jwt = require('express-jwt');
const config = require('../config');

let jwtConfig = jwt({
    secret: config.secret,
    requestProperty: 'authorization',
    getToken: (req) => {
        let token = req.headers.authorization || req.headers.Authorization;
        if (token && token.split(' ')[0] === 'Bearer') {
            return token.split(' ')[1];
        }
        return null;
    }
}).unless({path: ['/api/', /\/auth.+$/g]});

module.exports = (() => {
    console.warn('The jwt.js module is deprecated');
    return jwtConfig;
})();
