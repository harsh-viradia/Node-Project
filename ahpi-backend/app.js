global.logger = require("./src/services/logger.service");
global.baseDir = __dirname;
const express = require("express");
const router = express.Router()
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");
dotenv.config();
const cors = require("cors");
const app = express();
const { store } = require("roles-and-permission-node");
const initSeed = require("./src/components/seeders/index");
const api = require("express-list-endpoints-descriptor")(express);
const i18next = require("i18next");
const i18nextMiddleware = require("i18next-http-middleware");
const FilesystemBackend = require("i18next-node-fs-backend");
const { masters } = require('@knovator/masters-node')
const { convertToTz } = require('./src/services/timezone.service')
const { slugify, randomString } = require("./src/configuration/common")
const { localize, toTitleCase } = require('./src/services/localize.service')
const auth = require('./src/middleware/authentication')
const {createRedisServer} = require("./src/services/redis.service");
// const requestAPILog = require('./src/services/APILogger');

require('./src/configuration/firebaseConfig');

global.utils = require("./src/helper/utils/messages");
global.slugify = slugify;
require('./src/configuration/db')
const { morganInstance } = require("./src/services/logger.service");
global._ = require("lodash");
global.config = require('./src/configuration/config')
global.catchAsync = require("./src/services/catchAsync.service");
global.validate = require('./src/middleware/validate')
global.convertToTz = convertToTz
global._localize = localize;
global._toTitleCase = toTitleCase;
global._random = randomString;
global.hasAccess = require("./src/middleware/ahpi/authentication").hasAccess
global.authenticate = require("./src/middleware/ahpi/authentication").authenticate
global._checkPermission = require("./src/middleware/ahpi/authentication").checkPermission

app.use(router.get("/ping", catchAsync((req, res) => {
    res.message = "OrbitSkills server sending success response."
    utils.successResponse({}, res)
}))) 

i18next
    .use(FilesystemBackend)
    .use(i18nextMiddleware.LanguageDetector)
    .init({
        lng: process.env.LNG ?? "en",
        ns: [
            "file",
            "permission",
            "master",
            "specificMsg",
            "common"
        ],
        defaultNS: [
            "file",
            "permission",
            "master",
            "specificMsg",
            "common"
        ],
        backend: {
            loadPath: path.join(__dirname, `/src/lang/{{lng}}/{{ns}}.json`),
            addPath: path.join(__dirname, `/src/lang/{{lng}}/{{ns}}.json`),
        },
        detection: {
            order: ["header", "querystring"/*, "cookie"*/],
            lookupHeader: "lng",
            caches: false,
        },
        fallbackLng: process.env.LNG ?? "en",
        preload: ["en", "id"],
    });
app.use(i18nextMiddleware.handle(i18next));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const corsOpts = {
    origin: [
        "https://dev.orbitskills.id",
        "https://apidev.orbitskills.id",
        "https://admindev.orbitskills.id",
        "https://orbitlms.knovator.in",
        "https://admin.orbitlms.knovator.in",
        "http://localhost:4872",
        "http://localhost:5689",
        "http://localhost:5050",
        "https://apiquality.orbitskills.id",
        "https://quality.orbitskills.id",
        "https://adminquality.orbitskills.id",
        "https://s3-vdo-qua.s3.ap-southeast-3.amazonaws.com",
        "https://orbitskills.id",

        //ahpi dev urls.
        "http://localhost:5050",
        "https://apiahpi.knovator.in/",
        "https://apiahpi.knovator.in",
        "https://adminahpi.knovator.in",
        "https://ahpi.knovator.in/",
        "https://ahpi.knovator.in",

        // production urls
        "https://apiacademy.ahpi.in",
        "https://adminacademy.ahpi.in",
        "https://academy.ahpi.in",
        "https://apiacademy.ahpi.in/",
        "https://adminacademy.ahpi.in/",
        "https://academy.ahpi.in/",
        // "https://videosquality.orbitskills.id",
        // "https://videos.orbitskills.id",
        // "https://videosdev.orbitskills.id"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept-Language", "lng", "Cashing-Key","cache-key"],
};

const mastersConfig = {
    convertToTz,
    catchAsync,
    logger
  }

app.use(router.get("/ping", catchAsync((req, res) => {
    res.message = "OrbitSkills server sending success response."
    utils.successResponse({}, res)
}))) 

// todo cors temporary disabled for testing add once prod server up
app.use(cors(corsOpts));
app.use(morganInstance);
// app.use(requestAPILog) // TODO
require('./src/services/bull-jobs/eachProcess')
app.use("/admin/masters", masters(mastersConfig));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(require("./src/components/index"));

store(api.listEndpoints(app));
if (process.env.SEED) {
    initSeed();
}

const { runCrons } = require("./src/services/agendaCrons");
runCrons()
createRedisServer();

module.exports = app
