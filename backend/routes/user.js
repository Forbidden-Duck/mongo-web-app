const express = require("express");
const router = express.Router();
const sanitize = require("mongo-sanitize");

const { Utils: SuperUtils } = require("@forbidden_duck/super-mongo");
const {
    __schemas: { users: UserSchema },
} = require("../db");
const { authorize } = require("../loaders/routes");

/**
 *
 * @param {router} app
 * @param {import("../loaders/mongodb").MongoType} Mongo
 */
module.exports = (app, Mongo) => {
    app.use("/user", router);

    router.get("/", authorize(true, Mongo), async (req, res) => {
        try {
            const findUser = await Mongo.services.UserService.find({
                _id: req.authorized.data.userid,
            });
            if (!findUser || findUser._id === undefined) {
                res.status(403).send("User account does not exist");
            } else {
                delete findUser.password; // Don't send the password back
                res.status(200).send(findUser);
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
    const updateValidation = (req, res, next) => {
        try {
            req.bodyParsed = SuperUtils.Obj2Schema.compare(
                req.body,
                {
                    username: UserSchema.username,
                    email: UserSchema.email,
                    password: UserSchema.password,
                },
                { noUndefined: true, strictMode: { strictType: true } }
            );
            next();
        } catch (err) {
            res.sendStatus(400);
        }
    };
    router.put(
        "/",
        authorize(true, Mongo),
        updateValidation,
        async (req, res) => {
            try {
                const updatedUser = await Mongo.services.UserService.update(
                    {
                        $set: req.bodyParsed,
                    },
                    { _id: req.authorized.data.userid }
                );
                delete updatedUser.password; // Don't send the password back
                res.status(200).send(updatedUser);
            } catch (err) {
                // Update 404 to be 401
                if (err.status === 404) {
                    err.status = 401;
                    err.message = "User account does not exist";
                }
                res.status(err.status || 500).send(err.message);
            }
        }
    );

    /**
     *
     * @param {express.Request} req
     * @param {express.Response} res
     * @param {express.NextFunction} next
     */
    const deleteValidation = (req, res, next) => {
        if (
            typeof req.body === "object" &&
            typeof req.body.password === "string"
        ) {
            next();
        } else {
            res.sendStatus(400, "Missing password in body");
        }
    };
    router.delete(
        "/",
        authorize(true, Mongo),
        deleteValidation,
        async (req, res) => {
            try {
                const isDeleted = await Mongo.services.UserService.delete(
                    req.body.password,
                    { _id: req.authorized.data.userid }
                );
                if (isDeleted) {
                    res.sendStatus(200);
                } else {
                    res.status(500).send("User not deleted");
                }
            } catch (err) {
                res.status(err.status || 500).send(err.message);
            }
        }
    );
};
