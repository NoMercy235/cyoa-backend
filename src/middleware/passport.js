let passport = require('passport');
let passportJWT = require('passport-jwt');

let User = require('../models/user').model;
let config = require('../config');

let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;

let strategy = new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.secret
}, function(jwt, next) {
    User.findOne({
        email: jwt.email
    }, (err, user) => {
        if (user) {
            next(null, user.safeToSend(true));
        } else {
            next(null, false);
        }
    });
});

passport.use(strategy);

module.exports = {
    passport: passport,
    prefix: '/api'
};