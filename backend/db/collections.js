const { Collection } = require("@forbidden_duck/super-mongo");
const schemas = require("./schemas");

module.exports.ips = new Collection("ips", schemas.ips, {
    createIfNotExist: true,
});

module.exports.refresh_tokens = new Collection(
    "refresh_tokens",
    schemas.refresh_tokens,
    { createIfNotExist: true }
);

module.exports.users = new Collection("users", schemas.users, {
    createIfNotExist: true,
});

module.exports.saveddbs = new Collection("saveddbs", schemas.saveddbs, {
    createIfNotExist: true,
});
