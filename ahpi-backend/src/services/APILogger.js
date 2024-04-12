const { transports } = require('winston');
const expressWinston = require('express-winston');
const moment = require('moment-timezone');
require('winston-mongodb');

const requestLogger = expressWinston.logger({
    transports: [
        new transports.MongoDB({
            db: process.env.LOG_DB_URL,
            collection: process.env.LOG_DB_COLLECTION || 'APILogs',
            metaKey: 'meta',
            options: {
                poolSize: 5,
                useNewUrlParser: true,
                useUnifiedTopology: true,
            },
        }),
    ],
    meta: true,
    msg() {
        return `${moment().format(
            'YYYY-MM-DD HH:mm:ss',
        )} - Request: HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms : ipAddress {{req.connection.remoteAddress}}`;
    },
    requestWhitelist: [
        'url',
        'method',
        'httpVersion',
        'originalUrl',
        'query',
        'body',
        'headers',
    ],
    responseWhitelist: ['statusCode', 'body'],
    dynamicMeta: () => {
        const meta = {};
        meta.server = process.env.SERVER;
        meta.logType = 'request';
        return meta;
    },
});

module.exports = requestLogger;
