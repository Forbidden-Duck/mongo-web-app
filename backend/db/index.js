const { Database } = require("@forbidden_duck/super-mongo");
const collections = require("./collections");
const schemas = require("./schemas");

module.exports = new Database(process.env.DBCOLLECTION, [
    collections.ips,
    collections.refresh_tokens,
    collections.users,
    collections.saveddbs,
]);

module.exports.__collections = collections;

module.exports.__schemas = schemas;
