const Agenda = require("agenda")
const config = require('./config.js');

const dbConfigure = `${config.server.DB_USERNAME}${config.server.DB_PASSWORD}`;
const mongoConnectionURI = `${config.server.DB_CONNECTION}://${dbConfigure}${config.server.DB_HOST}${config.server.DB_PORT}/${config.server.DB_DATABASE}` +
    (config.server.REPLICASET ? `?replicaset=${config.server.REPLICASET}` : "");

const agenda = new Agenda({ db: { address: mongoConnectionURI, collection: "crons" } })

module.exports = agenda