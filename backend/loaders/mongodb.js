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
    // Created refresh_tokens index
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
    // Create email verification index
    // Make sure it has the correct expiry
    const emailExpiry = (
        await Database.__collections.emailverification.indexes()
    ).find((index) => index.name === "createdAt_1");
    if (
        !emailExpiry ||
        emailExpiry.expireAfterSeconds !==
            parseInt(process.env.EMAILEXPIRYINSECS)
    ) {
        if (emailExpiry) {
            await Database.__collections.emailverification.dropIndex(
                "createdAt_1"
            );
        }
        await Database.__collections.emailverification.createIndex(
            {
                createdAt: 1,
            },
            { expireAfterSeconds: parseInt(process.env.EMAILEXPIRYINSECS) }
        );
    }
    const IPService = new (require("../services/IPService"))();
    const DBService = new (require("../services/DBService"))();
    const UserService = new (require("../services/UserService"))(DBService);
    const EmailService = new (require("../services/EmailService"))(UserService);
    const AuthService = new (require("../services/AuthService"))(
        UserService,
        EmailService
    );
    DBService.UserService = UserService;
    return {
        client: MongoClient,
        services: {
            IPService,
            DBService,
            UserService,
            EmailService,
            AuthService,
        },
    };
};

/**
 * @typedef {object} MongoType
 * @property {SuperMongo.MongoClient} client
 * @property {object} services
 * @property {import("../services/IPService")} services.IPService
 * @property {import("../services/DBService")} services.DBService
 * @property {import("../services/UserService")} services.UserService
 * @property {import("../services/EmailService")} services.EmailService
 * @property {import("../services/AuthService")} services.AuthService
 */
