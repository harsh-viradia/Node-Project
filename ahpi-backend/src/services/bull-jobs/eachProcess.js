
const EventEmitter = require("events");
EventEmitter.defaultMaxListeners = 50;
const {_processors} = require('./processors');
const { AHPI_emailQueue, AHPI_notificationQueue, AHPI_generateCertiQueue, AHPI_refUpdateQueue } = require("./jobConfig");

for (let identity in _processors) {
    AHPI_emailQueue.process(identity, 1, _processors[identity]);
    AHPI_notificationQueue.process(identity, 1, _processors[identity]);
    AHPI_generateCertiQueue.process(identity, 1, _processors[identity]);
    AHPI_refUpdateQueue.process(identity, 1, _processors[identity]);
}