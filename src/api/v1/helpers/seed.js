const { Permission, Manager } = require("../models");
const { RESOURCE, ACCESS } = require("./../data");
const { logger, isDev } = require("../utils");

exports.run = async () => {
  try {
    logger.warn(" > Seeding Database...");
    const resources = Object.values(RESOURCE);
    const accessKeys = Object.values(ACCESS);

    const result = [];

    for (let i = 0; i < resources.length; i++) {
      for (let j = 0; j < accessKeys.length; j++) {
        await Permission.findOneAndUpdate(
          { resource: resources[i], type: accessKeys[j] },
          { name: accessKeys[j] + " " + resources[i] },
          { upsert: true }
        );
      }
      result.push({ key: resources[i], values: `${accessKeys}` });
    }

    let superadmin = await Manager.findOne({
      email: process.env.SUPERADMIN_EMAIL,
    });

    if (!superadmin) {
      superadmin = await new Manager({
        email: process.env.SUPERADMIN_EMAIL,
        password: process.env.SUPERADMIN_PASSWORD,
      }).save();
    }

    result.push({ key: "superadmin", values: `${superadmin.email}` });

    if (isDev) console.table(result);
    logger.info("✅ Seeding Succesfull.");
  } catch (error) {
    console.log(error);
    logger.error(`⛔ Failed to seed database, ${error.message}`);
    logger.error("🛑 Exiting ...");
    process.exit(0);
  }
};
