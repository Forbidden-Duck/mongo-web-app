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
