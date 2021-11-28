const express = require("express");
const router = express.Router();
const SuperMongo = require("@forbidden_duck/super-mongo");

const ClientSchema = {
    address: SuperMongo.DataTypes.JSString,
    host: SuperMongo.DataTypes.JSString,
    username: SuperMongo.DataTypes.JSString,
    password: SuperMongo.DataTypes.JSString,
};

/**
 *
 * @param {router} app
 */
module.exports = (app) => {
    app.use("/mongodb", router);

    router.use(async (req, res, next) => {
        // Validate the schema
        req.query = SuperMongo.Utils.Obj2Schema.compare(
            req.query,
            ClientSchema,
            {
                noUndefined: true,
            }
        );
        if (req.query.address === undefined || req.query.host === undefined) {
            return res.sendStatus(400);
        }
        try {
            // Attempt to connect to the client
            req.mongo = await new SuperMongo.MongoClient(req.query).connect();
            next();
        } catch (err) {
            if (
                err.message.startsWith("connect ETIMEDOUT") ||
                err.message.startsWith("getaddrinfo ENOTFOUND")
            ) {
                res.status(500).send("Connection timed out");
            } else if (
                err.message === "Failed to authenticate with the Database"
            ) {
                res.status(500).send(
                    "Failed to authenticate with the database"
                );
            } else {
                res.status(500).send(err.message);
                console.log(err);
            }
        }
    });

    router.get(
        "/databases",
        async (
            /** @type {express.Request & { mongo: SuperMongo.MongoClient }}  */ req,
            res,
            next
        ) => {
            try {
                const dbs = await req.mongo.client.db().admin().listDatabases();
                res.status(200).send(dbs);
            } catch (err) {
                if (
                    err.message ===
                    "command listDatabases requires authentication"
                ) {
                    res.status(500).send(
                        "Viewing databases requires authentication"
                    );
                } else {
                    res.status(500).send(err.message);
                    console.log(err);
                }
            }
            next();
        }
    );

    router.get(
        "/collections",
        async (
            /** @type {express.Request & { mongo: SuperMongo.MongoClient }}  */ req,
            res,
            next
        ) => {
            try {
                const colls = await req.mongo.client
                    .db(req.query.host)
                    .listCollections()
                    .toArray();
                res.status(200).send(colls);
            } catch (err) {
                if (
                    err.message ===
                    "command listCollections requires authentication"
                ) {
                    res.status(500).send(
                        "Viewing collections requires authentication"
                    );
                } else {
                    res.status(500).send(err.message);
                    console.log(err);
                }
            }
        }
    );

    router.get(
        "/collection/:collection",
        async (
            /** @type {express.Request & { mongo: SuperMongo.MongoClient }}  */ req,
            res,
            next
        ) => {
            try {
                let limit = 100;
                if (req.query.limit && req.query.limit > 0) {
                    limit = parseInt(req.query.limit);
                }
                let skip = 0;
                if (req.query.skip && req.query.skip > 0) {
                    skip = parseInt(req.query.skip);
                }
                const colls = await req.mongo.client
                    .db(req.query.host)
                    .collection(req.params.collection)
                    .find()
                    .limit(limit)
                    .skip(skip)
                    .toArray();
                res.status(200).send(colls);
            } catch (err) {
                if (err.message === "command find requires authentication") {
                    res.status(500).send(
                        "Viewing documents requires authentication"
                    );
                } else {
                    res.status(500).send(err.message);
                    console.log(err);
                }
            }
        }
    );

    router.use(
        (
            /** @type {express.Request & { mongo: SuperMongo.MongoClient }}  */ req
        ) => {
            req.mongo.close(true);
        }
    );
};
