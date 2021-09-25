const expressLoader = require("./express");
const mongodbLoader = require("./mongodb");
const routeLoader = require("./routes");

/**
 *
 * @param {import("express").Express} app
 * @returns {mongodbLoader.MongoType}
 */
module.exports = async (app) => {
    const expressApp = await expressLoader(app);
    const Mongo = await mongodbLoader();
    routeLoader(expressApp, Mongo);
    return Mongo;
};
