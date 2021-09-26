const jwt = require("jsonwebtoken");
const path = require("path");

/**
 *
 * @param {import("express").Express} app
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
 * Get the Authorization header
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
module.exports.getAuthorization = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (typeof authHeader === "string" && authHeader.length > 0) {
        const bearer = authHeader.split(" ")[0];
        const token = authHeader.split(" ")[1];
        if (bearer === "Bearer") {
            return jwt.verify(token, process.env.JWTSECRET, (err, data) => {
                if (err) {
                    return res.sendStatus(401);
                }
                req.token = token;
                req.tokenData = data;
                next();
            });
        }
        return res.sendStatus(
            400,
            "Missing Bearer type in authorization header"
        );
    }
    res.sendStatus(400, "Missing authorization header");
};
