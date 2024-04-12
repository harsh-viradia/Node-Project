const Role = require("../roles/roleModel");
const User = require("../user/userModel");
const PageModel = require("../page/pageModel");
const dbService = require("../../services/db.service");
const seriesGenerator = require("../common/models/seriesGenerator");
const Settings = require("../settings/settings.model");
const { Master } = require("@knovator/masters-node");
const Templates = require('../emails/templatesModel')
const Certificate = require('../certificates/certificate.model')
const moment = require("moment-timezone")
const bcrypt = require("bcrypt")
const { generateToken } = require("../user/authentication/authenticationService")
const { BCRYPT } = require("../../configuration/config")

const seedRoles = async () => {
    try {
        const rolesJSON = require("./roles.json");
        Promise.all(
            _.map(rolesJSON, async (data) => {
                let findRole = await Role.findOne({ code: data.code });
                if (!findRole) {
                    await Role.create(data);
                }
            })
        );
        logger.info("Roles seeded successfully!");
        return true;
    } catch (error) {
        logger.error("Error in seedRoles!", error);
        throw new Error(error);
    }
};

const seedAdmin = async () => {
    try {
        const adminJSON = require("./admin.json");
        await Promise.all(
            _.map(adminJSON, async (data) => {
                let roles = [];
                let findUser = await User.findOne({ email: data.email });
                const findRole = await Role.findOne({ code: data.role });
                if (!findUser) {
                    roles.push({ roleId: findRole._id });
                    const pass = bcrypt.hashSync(data?.passwords[0].pass, parseInt(BCRYPT.SALT))
                    data = {
                        email: data?.email,
                        mobileNumber: data?.mobNo,
                        mobNo: data?.mobNo,
                        passwords: { pass: pass, createdAt: moment().toDate() },
                        firstName: data?.firstName,
                        lastName: data?.lastName,
                        countryCode: data?.countryCode,
                        roles: roles,
                        createdAt: new Date()
                    }
                    const user = await User.create(data);
                    const token = await generateToken(user, true)

                    await User.findOneAndUpdate({ _id: user?._id }, { $push: { tokens: { token: token.authToken, expire: token.expireTime } } })
                }
            })
        );
        logger.info("Admin seeded successfully! 👦👩");
        return true;
    } catch (error) {
        logger.error("Error in seedAdmin!", error);
    }
};
const seedHomePage = async () => {
    try {
        const pageJSON = require("./homePage.json");
        await Promise.all(_.map(pageJSON, async (data) => {
            let findPage = await PageModel.findOne({ slug: data.slug });
            if (!findPage) {
                await PageModel.create(data);
            }
        })
        );
        logger.info("Page seeded successfully!");
        return true;
    } catch (error) {
        logger.error("Error in seedHomePage!", error);
    }
}

const seedSeries = async () => {
    try {
        const seriesGeneratorJSON = require("./seriesGenerator.json");
        await Promise.all(
            _.map(seriesGeneratorJSON, async (data) => {
                let series = await dbService.getDocumentByQuery(seriesGenerator, { type: data.type })
                if (!series) {
                    await dbService.createDocument(seriesGenerator, data);
                }
            })
        );
        logger.info("Series seeded successfully!");
        return true;
    } catch (error) {
        logger.error("Error in seedSeries!", error);
    }
};

const seedSettings = async () => {
    try {
        const settingJSON = require("./settings.json");
        await Promise.all(
            _.map(settingJSON, async (data) => {
                let setting = await dbService.getDocumentByQuery(Settings, { code: data.code });
                if (setting) {
                    await dbService.updateDocument(Settings, data._id, data, { updatedAt: new Date() });
                } else {
                    await dbService.createDocument(Settings, data);
                }
            })
        );
        logger.info("Settings seeded successfully!");
        return true;
    } catch (error) {
        logger.error("Error in seedSettings!", error);
    }
};

const seedMaster = async () => {
    try {
        const masterJSON = require("./master.json");
        masterJSON.forEach(async (data) => {
            let findMaster = await Master.findOne({ code: data?.code });
            if (!findMaster) {
                await Master.create(data);
            }
            await Promise.all(_.map(data?.subMaster, async (subData) => {
                let findSubMaster = await Master.findOne({ code: subData?.code });
                if (!findSubMaster) {
                    await Master.create(subData);
                }
            }));
        });
        logger.info("Master seeded successfully!");
    } catch (error) {
        logger.error("Error in seedMaster!", error);
    }
}

const seedEjsTemplates = async () => {
    try {
        const ejsTemplates = require('./ejsTemplates.json')
        await Promise.all(ejsTemplates.map(async (htmlData) => {
            let ejsTemplate = await dbService.getDocumentByQuery(Templates, { code: htmlData.code })
            if (ejsTemplate) {
                await dbService.updateDocument(Templates, ejsTemplate._id, htmlData);
            } else {
                await dbService.createDocument(Templates, htmlData);

            }
        }));
        logger.info('EJS templates seeded successfully!');
        return true;
    } catch (error) {
        logger.error('Error in seedEjsTemplates!');
    }
}

const seedCertificates = async () => {
    try {
        const certificateJSON = require('./certificate.json');
        await Promise.all(certificateJSON.map(async (certificateData) => {
            let findCertificateSeeder = await Certificate.findOne({ code: certificateData?.code });
            if (!findCertificateSeeder) {
                await dbService.createDocument(Certificate, certificateData);
            }
        }))
        logger.info('Certificate  seeded successfully!');
        return true;
    } catch (error) {
        logger.error('Error in seedCertificates!');
    }
}

module.exports = {
    seedRoles,
    seedAdmin,
    seedHomePage,
    seedSeries,
    seedSettings: seedSettings,
    seedMaster,
    seedEjsTemplates,
    seedCertificates
};
