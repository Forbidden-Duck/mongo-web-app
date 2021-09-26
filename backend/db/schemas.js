const { DataTypes } = require("@forbidden_duck/super-mongo");

module.exports.ips = {
    _id: DataTypes.Ignore,
    address: DataTypes.JSString,
    count: DataTypes.JSInt64,
    createdAt: DataTypes.JSDate,
    modifiedAt: DataTypes.JSDate,
};

module.exports.refresh_tokens = {
    _id: DataTypes.Ignore,
    userid: DataTypes.JSString,
    createdAt: DataTypes.JSDate,
};

module.exports.users = {
    _id: DataTypes.Ignore,
    username: DataTypes.JSString,
    password: DataTypes.JSString,
    email: DataTypes.JSString,
    createdAt: DataTypes.JSDate,
    modifiedAt: DataTypes.JSDate,
};

module.exports.saveddbs = {
    _id: DataTypes.Ignore,
    userid: DataTypes.JSString,
    address: DataTypes.JSString,
    host: DataTypes.JSString,
    username: DataTypes.JSString,
    password: DataTypes.JSString,
    favourite: DataTypes.JSBoolean,
    createdAt: DataTypes.JSDate,
    modifiedAt: DataTypes.JSDate,
};
