const express = require("express");
const apiRoute = express.Router();
const jwt = require("jsonwebtoken");
const crypto = require("../crypto");
const path = require("path");

/**
 *
 * @param {express.Express} app
 * @param {import("./mongodb").MongoType} Mongo
 */
module.exports = (app, Mongo) => {
    app.use(async (req, res, next) => {
        // Remove PORT from ip
        const address = req.ip.replace(/((?::))(?:[0-9]+)$/, "");
        const ipDocument = await Mongo.services.IPService.find({ address });
        if (ipDocument && ipDocument._id) {
            await Mongo.services.IPService.update(
                {
                    $inc: {
                        count: 1,
                    },
                },
                { _id: ipDocument._id }
            );
        } else {
            await Mongo.services.IPService.create({ address, count: 1 });
        }
        next();
    });

    app.use("/api", apiRoute);
    require("../routes/auth")(apiRoute, Mongo);
    require("../routes/user")(apiRoute, Mongo);
    // TODO Routes

    app.use((req, res, next) => {
        if (process.env.NODE_ENV === "production") {
            res.sendFile(
                path.resolve(__dirname, "../../frontend/build", "index.html")
            );
        } else {
            next();
        }
    });
};

/**
 * Authorize the session_token or refresh_token
 * @param {boolean} endIfFailed
 * @param {import("./mongodb").MongoType} Mongo
 * @returns {(req: express.Request, res: express.Response, next: express.NextFunction) => void}
 */
module.exports.authorize = (endIfFailed, Mongo) => {
    endIfFailed = !!endIfFailed;
    /**
     * @param {express.Request} req
     * @param {express.Response} res
     * @param {express.NextFunction} next
     * @returns {void}
     */
    return (req, res, next) => {
        /**
         * Refreshes the refreshtoken otherwise returns false
         * @param {string} token
         * @returns {import("../services/AuthService").ReturnLoginType}
         */
        async function checkReToken(token) {
            if (typeof token === "string") {
                try {
                    return await Mongo.services.AuthService.refreshtoken(token);
                } catch (err) {}
            }
            return false;
        }
        async function onError() {
            const refreshObj = await checkReToken(reToken);
            if (refreshObj) {
                // Set the cookies, based on the returned tokens
                res.cookie("refresh_token", refreshObj.refreshtoken, {
                    maxAge: 2.592e9, // 30 days
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                });
                res.cookie("session_token", refreshObj.token, {
                    maxAge: 900000,
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                });
                // Send the data formatted how the JWTs are signed
                req.authorized = {
                    ok: true,
                    data: {
                        userid: refreshObj.user._id,
                        userWhenSigned: refreshObj.user,
                    },
                };
                next();
            } else {
                // If the refresh failed delete both cookies
                res.cookie("session_token", "", {
                    maxAge: 0,
                    expires: new Date(0),
                });
                res.cookie("refresh_token", "", {
                    maxAge: 0,
                    expires: new Date(0),
                });
                if (endIfFailed) {
                    res.sendStatus(401);
                } else {
                    req.authorized = { ok: false };
                    next();
                }
            }
        }
        const jwtToken = req.cookies["session_token"];
        const reToken = req.cookies["refresh_token"];
        if (typeof jwtToken === "string") {
            jwt.verify(jwtToken, crypto.options.jwtkey, (err, data) => {
                if (err) {
                    onError();
                } else {
                    req.authorized = { ok: true, data: data };
                    next();
                }
            });
        } else {
            // If there is no jwtToken, onError will attempt to refresh token anyway
            onError();
        }
    };
};
