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
    app.use("/auth", router);

    /**
     *
     * @param {express.Request} req
     * @param {express.Response} res
     * @param {express.NextFunction} next
     */
    const registerValidation = async (req, res, next) => {
        try {
            req.bodyParsed = SuperUtils.Obj2Schema.compare(
                req.body,
                {
                    username: UserSchema.username,
                    email: UserSchema.email,
                    password: UserSchema.password,
                },
                { strictMode: { strictType: true } }
            );
        } catch (err) {
            res.sendStatus(400);
            return;
        }
        next();
    };
    router.post("/register", registerValidation, async (req, res) => {
        try {
            const user = await Mongo.services.AuthService.register(
                req.bodyParsed
            );
            delete user.password; // Do not send the user's password back
            res.status(201).send(user);
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
    const loginValidation = async (req, res, next) => {
        try {
            req.bodyParsed = SuperUtils.Obj2Schema.compare(
                req.body,
                {
                    username: UserSchema.username,
                    password: UserSchema.password,
                },
                { strictMode: { strictType: true } }
            );
        } catch (err) {}
        next();
    };
    router.post(
        "/login",
        loginValidation,
        authorize(false, Mongo),
        async (req, res) => {
            try {
                let tokenObj;
                const reToken =
                    await Mongo.services.AuthService.findRefreshToken({
                        _id: req.cookies["refresh_token"],
                    });
                if (req.bodyParsed) {
                    tokenObj = await Mongo.services.AuthService.login(
                        req.bodyParsed.username,
                        req.bodyParsed.password
                    );
                } else if (req.authorized.ok && reToken && reToken._id) {
                    tokenObj = await Mongo.services.AuthService.refreshtoken(
                        reToken._id
                    );
                } else {
                    return res.sendStatus(400);
                }
                res.cookie("refresh_token", tokenObj.refreshtoken, {
                    maxAge: 2.592e9, // 30 days
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                });
                res.cookie("session_token", tokenObj.token, {
                    maxAge: 900000, // 15 mins
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                });
                delete tokenObj.user.password; // Do not send the user's password back
                res.status(200).send(tokenObj.user);
            } catch (err) {
                res.status(err.status || 500).send(err.message);
            }
        }
    );

    router.post("/logout", authorize(true, Mongo), async (req, res) => {
        try {
            await Mongo.services.AuthService.logout(
                req.cookies["refresh_token"]
            );
            // Ensure both cookies are deleted on logout
            res.cookie("session_token", "", {
                maxAge: 0,
                expires: new Date(0),
            });
            res.cookie("refresh_token", "", {
                maxAge: 0,
                expires: new Date(0),
            });
            res.sendStatus(200);
        } catch (err) {
            res.status(err.status || 500).send(err.message);
        }
    });

    router.get("/verify/:token", async (req, res) => {
        try {
            const isVerified = await Mongo.services.EmailService.verify(
                req.params.token
            );
            if (isVerified) {
                res.sendStatus(200);
            } else {
                res.sendStatus(401);
            }
        } catch (err) {
            res.status(err.status || 500).send(err.message);
        }
    });
};
