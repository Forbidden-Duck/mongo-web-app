const Database = require("../db");
const SuperMongo = require("@forbidden_duck/super-mongo");

// TODO Services

module.exports = async () => {
    const MongoClient = await new SuperMongo.MongoClient(
        {
            address: process.env.DBADDRESS,
            host: process.env.DBHOST,
            username: process.env.DBUSERNAME,
            password: process.env.DBPASSWORD,
        },
        [Database]
    ).connect();
    if (
        !(await Database.__collections.refresh_tokens.indexExists(
            "createdAt_1"
        ))
    ) {
        await Database.__collections.refresh_tokens.createIndex(
            { createdAt: 1 },
            { expireAfterSeconds: 2592000 }
        );
    }
    const IPService = new (require("../services/IPService"))();
    return {
        client: MongoClient,
        services: {
            IPService,
        },
    };
};

/**
 * @typedef {object} MongoType
 * @property {SuperMongo.MongoClient} client
 * @property {object} services
 * @property {import("../services/IPService")} services.IPService
 */
