const bullQueue = require("bull");
const { REDIS } = require('../../configuration/config');

const emailRedisOptions = {
  redis: {
    host: REDIS.HOST,
    port: REDIS.PORT,
    db: 5,
  }
}

const notificationRedisOptions = {
  redis: {
    host: REDIS.HOST,
    port: REDIS.PORT,
    db: 6,
  }
}

const generateCertiRedisOptions = {
  redis: {
    host: REDIS.HOST,
    port: REDIS.PORT,
    db: 7,
  }
}

const refUpdateOpts = {
  redis: {
    host: REDIS.HOST,
    port: REDIS.PORT,
    db: 8,
  }
}

const AHPI_refUpdateQueue = new bullQueue("AHPI_AHPI_refUpdateQueue", refUpdateOpts)
const AHPI_emailQueue = new bullQueue("AHPI_AHPI_emailQueue", emailRedisOptions);
const AHPI_notificationQueue = new bullQueue("AHPI_AHPI_notificationQueue", notificationRedisOptions);
const AHPI_generateCertiQueue = new bullQueue("AHPI_AHPI_generateCertiQueue", generateCertiRedisOptions);


logger.info('Bull Queue Loaded! ⌛✔️ ')

// Function that handles job failure.
const handleFailure = (job, err) => {
  if (job.attemptsMade >= job.opts.attempts) {
    logger.info(`🤯 Job ${job.name} failures above threshold. Error: `, err);
    // job.remove();
    return null;
  }
  logger.info(`🤯 Job ${job.name} failed with ${err.message}. ${job.opts.attempts - job.attemptsMade} attempts left.`);
};

// Function that handles job completion.
const handleCompleted = job => {
  logger.info(`🌿 Job ${job.name} completed.`);
  job.remove();
};

// Function that handles stalled job.
const handleStalled = job => {
  logger.info(`🌿 Job ${job.name} stalled.`);
};

// bull-queue Events listeners 
AHPI_emailQueue.on("stalled", handleStalled);
AHPI_emailQueue.on("completed", handleCompleted);
AHPI_emailQueue.on("failed", handleFailure);

AHPI_notificationQueue.on("stalled", handleStalled);
AHPI_notificationQueue.on("completed", handleCompleted);
AHPI_notificationQueue.on("failed", handleFailure);

AHPI_generateCertiQueue.on("stalled", handleStalled);
AHPI_generateCertiQueue.on("completed", handleCompleted);
AHPI_generateCertiQueue.on("failed", handleFailure);

AHPI_refUpdateQueue.on("stalled", handleStalled);
AHPI_refUpdateQueue.on("completed", handleCompleted);
AHPI_refUpdateQueue.on("failed", handleFailure);

module.exports = {
  AHPI_emailQueue,
  AHPI_notificationQueue,
  AHPI_generateCertiQueue,
  AHPI_refUpdateQueue
};