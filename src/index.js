const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const https = require('https');
const fs = require('fs');
const path = require('path');
const io = require('socket.io');
const http = require('http');

// For debugging
// mongoose.set('debug', true);

const config = require('./config');
const passportConfig = require('./middleware/passport');
const { handleSocket } = require('./sockets/setup');
const { SocketEvents } = require('./sockets/constants');

const port = process.env.PORT || 8080;
const httpsPort = process.env.HTTPS_PORT || 443;
// TODO: check this sometime
// const allowedOrigins = ['localhost:*', 'https://rigamo.xyz', 'https://api.rigamo.xyz', 'https://*.rigamo.xyz'];
const allowedOrigins = 'localhost:* rigamo.xyz:443';

// Overriding the deprecated "Promise" module of mongoose.
// For more information see: https://github.com/Automattic/mongoose/issues/4291
mongoose.Promise = global.Promise;
// Providing the 'useMongoClient' property to get rid of the deprecated message.
mongoose.connect(
    config.database,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        keepAlive: false,
    },
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '400kb' }));


app.use(cors());
app.use(morgan('dev'));

app.use(passportConfig.passport.initialize());
app.use(passportConfig.prefix, passportConfig.passport.authenticate('jwt', { session: false }));

let apiRoutes = require('./api').routes;
Object.keys(apiRoutes).forEach((key) => {
    app.use(apiRoutes[key].prefix, apiRoutes[key].routes);
});

const httpServer = http.createServer(app);

httpServer.listen(port, () => {
    console.log(`HTTP Server started on port: ${port}`);
});

const ioServer = io(httpServer, { origins: allowedOrigins });
ioServer.on(SocketEvents.Connection, handleSocket);

// HTTPS server config
try {
    const keyPath = path.join(__dirname, '..', 'certs', 'privkey.pem');
    const certPath = path.join(__dirname, '..', 'certs', 'fullchain.pem');
    const serverKey = fs.readFileSync(keyPath);
    const serverCert = fs.readFileSync(certPath);

    const options = {
        key: serverKey,
        cert: serverCert,
    };

    const httpsServer = https.createServer(options, app);
    httpsServer.listen(httpsPort, () => {
        console.log(`HTTPS Server started on port: ${httpsPort}`);
    });
    const iosServer = io(httpsServer, { origins: allowedOrigins });
    iosServer.on(SocketEvents.Connection, handleSocket);
} catch (e) {
    console.log('No certs for HTTPS');
}
