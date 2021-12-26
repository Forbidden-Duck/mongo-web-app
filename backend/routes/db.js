const express = require("express");
const router = express.Router();
const sanitize = require("mongo-sanitize");

const { Utils: SuperUtils } = require("@forbidden_duck/super-mongo");
const {
    __schemas: { saveddbs: DBSchema },
} = require("../db");
const { authorize } = require("../loaders/routes");

/**
 *
 * @param {router} app
 * @param {import("../loaders/mongodb").MongoType} Mongo
 */
module.exports = (app, Mongo) => {
    app.use("/db", router);

    router.param("dbid", async (req, res, next, dbid) => {
        try {
            const findDB = await Mongo.services.DBService.find({ _id: dbid });
            if (!findDB || findDB._id === undefined) {
                return res.status(404).send("DB not found");
            }
            req.db = findDB;
            next();
        } catch (err) {
            res.status(err.status || 500).send(err.message);
        }
    });

    const validationSchema = {
        address: DBSchema.address,
        host: DBSchema.host,
        username: DBSchema.username,
        password: DBSchema.password,
        favourite: DBSchema.favourite,
    };

    // use /api/dbs for getting many dbs instead of /api/db
    app.get("/dbs", authorize(true, Mongo), async (req, res) => {
        try {
            const findUser = await Mongo.services.UserService.find({
                _id: req.authorized.data.userid,
            });
            if (!findUser || findUser._id === undefined) {
                res.status(403).send("User account does not exist");
            } else {
                res.status(200).send(
                    await Mongo.services.DBService.findMany({
                        userid: findUser._id,
                    })
                );
            }
        } catch (err) {
            res.status(err.status || 500).send(err.message);
        }
    });

    router.get("/:dbid", authorize(true, Mongo), async (req, res) => {
        try {
            if (req.db.userid !== req.authorized.data.userid) {
                res.status(403).send(
                    "You can not get other user's saved databases"
                );
            } else {
                res.status(200).send(req.db);
            }
        } catch (err) {
            res.status(err.status || 500).send(err.message);
        }
    });

    /**
     *
     * @param {express.Request} req
     * @param {express.Response} res
     * @param {express.NextFunction} next
     */
    const createValidation = (req, res, next) => {
        try {
            req.bodyParsed = SuperUtils.Obj2Schema.compare(
                req.body,
                validationSchema,
                { noUndefined: true, strictMode: { strictType: true } }
            );
            if (!req.bodyParsed.address) {
                res.sendStatus(400);
            } else if (
                (req.bodyParsed.username && !req.bodyParsed.password) ||
                (!req.bodyParsed.username && req.bodyParsed.password)
            ) {
                res.status(400).send(
                    "Username and password both have to be set (or unset)"
                );
            } else {
                next();
            }
        } catch (err) {
            res.sendStatus(400);
        }
    };
    router.post(
        "/",
        authorize(true, Mongo),
        createValidation,
        async (req, res) => {
            // Ensure favourite is a boolean
            req.bodyParsed.favourite = !!req.bodyParsed.favourite;
            // Make sure userid is set
            req.bodyParsed.userid = req.authorized.data.userid;
            try {
                const createdDB = await Mongo.services.DBService.create(
                    req.bodyParsed
                );
                res.status(201).send(createdDB);
            } catch (err) {
                res.status(err.status || 500).end(err.message);
            }
        }
    );

    /**
     *
     * @param {express.Request} req
     * @param {express.Response} res
     * @param {express.NextFunction} next
     */
    const updateValidation = (req, res, next) => {
        try {
            req.bodyParsed = SuperUtils.Obj2Schema.compare(
                req.body,
                validationSchema,
                { noUndefined: true, strictMode: { strictType: true } }
            );
            next();
        } catch (err) {
            res.sendStatus(400);
        }
    };
    router.put(
        "/:dbid",
        authorize(true, Mongo),
        updateValidation,
        async (req, res) => {
            // Ensure favourite is a boolean
            req.bodyParsed.favourite = !!req.bodyParsed.favourite;
            try {
                const updatedDB = await Mongo.services.DBService.update(
                    {
                        $set: req.bodyParsed,
                    },
                    { _id: req.db._id }
                );
                res.status(200).send(updatedDB);
            } catch (err) {
                res.status(err.status || 500).send(err.message);
            }
        }
    );

    router.delete("/:dbid", authorize(true, Mongo), async (req, res) => {
        try {
            const isDeleted = await Mongo.services.DBService.delete({
                _id: req.db._id,
            });
            if (isDeleted) {
                res.sendStatus(200);
            } else {
                res.status(500).send("DB not deleted");
            }
        } catch (err) {
            res.status(err.status || 500).send(err.message);
        }
    });
};
