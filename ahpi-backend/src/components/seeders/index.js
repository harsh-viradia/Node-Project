const service = require("./seederService");

async function initSeed() {
  try {
    await service.seedRoles();
    await service.seedAdmin();
    await service.seedHomePage();
    await service.seedSeries();
    await service.seedSettings();
    await service.seedMaster();
    await service.seedEjsTemplates();
    await service.seedCertificates();
  } catch (error) {
    logger.error("Error - Seed data failed!", error);
  }
}

module.exports = initSeed;
