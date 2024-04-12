module.exports = {
    server: {
        port: process.env.PORT || 4872,
        DB_CONNECTION: process.env.DB_CONNECTION || "mongodb",
        DB_HOST: process.env.DB_HOST || 'localhost',
        DB_PORT: process.env.DB_PORT === "" ? process.env.DB_PORT : process.env.DB_PORT ? `:${process.env.DB_PORT}` : ':27017',
        DB_DATABASE: process.env.DB_DATABASE || ``,
        DB_USERNAME: process.env.DB_USERNAME ? `${process.env.DB_USERNAME}:` : '',
        DB_PASSWORD: process.env.DB_PASSWORD ? `${process.env.DB_PASSWORD}@` : ''

    },
    auth: {
        jwtSecret: process.env.JWT_SECRET || '',
    },
    mailer: {
    },
    REDIS: {
        HOST: process.env.REDIS_HOST || '127.0.0.1',
        PORT: process.env.REDIS_PORT || 6379,
        PASSWORD_FOR_BULL: process.env.REDIS_PASSWORD ?? "",
        PASSWORD: process.env.REDIS_PASSWORD == "" ? process.env.REDIS_PASSWORD : process.env.REDIS_PASSWORD ? `:${process.env.REDIS_PASSWORD}@` : "",
        USER: process.env.REDIS_USER ?? ""
    },
    BCRYPT: {
        SALT: process.env.SALT || 10
    },
    LEARNER: {
        URL: process.env.FRONT_URL || "https://ahpi.knovator.in/",
        MY_LEARNING: process.env.PAYMENT_FRONT_URL || "https://ahpi.knovator.in/my-learning"
    },
    ENVIRONMENT: {
        KEY: process.env.ENV || "staging"
    }
}

// Validations for a required field in ENV.
if (!process.env.DB_CONNECTION || !process.env.DB_HOST || !process.env.DB_DATABASE || !process.env.DB_USERNAME || !process.env.DB_PASSWORD) {
    logger.error("MongoDB connection url not found in env.")
    process.exit(0)
}
