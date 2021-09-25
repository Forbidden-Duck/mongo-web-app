const path = require("path");

/**
 *
 * @param {import("express").Express} app
 * @param {import("./mongodb").MongoType} Mongo
 */
module.exports = (app, Mongo) => {
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
