/**
 * Mongoose Configuration
 */
const mongoose = require('mongoose');
const config = require('./config.js');
mongoose.Promise = global.Promise;

mongoose.connection.on("connected", async () => {
  logger.info("DATABASE - Connected");
});

mongoose.connection.on("error", (err) => {
  logger.error("DATABASE - Error:" + err);
});

mongoose.connection.on("disconnected", () => {
  logger.warn("DATABASE - disconnected  Retrying....");
});

const dbConfigure = `${config.server.DB_USERNAME}${config.server.DB_PASSWORD}`;
const dbConnection = `${config.server.DB_CONNECTION}://${dbConfigure}${config.server.DB_HOST}${config.server.DB_PORT}/${config.server.DB_DATABASE}` +
                      (config.server.REPLICASET ? `?replicaset=${config.server.REPLICASET}` : "");

const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
mongoose.connect(dbConnection, dbOptions).catch((err) => {
    logger.error("DATABASE - Error:" + err);
});
