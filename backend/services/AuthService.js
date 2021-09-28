const { Utils: SuperUtils } = require("@forbidden_duck/super-mongo");
const createError = require("http-errors");
const {
    __collections: {
        users: UserCollection,
        refresh_tokens: RefreshTokensCollection,
    },
} = require("../db");
const jwt = require("jsonwebtoken");
const crypto = require("../crypto");

/**
 * @typedef {object} ReturnLoginType
 * @property {UserCollection["schema"]} user
 * @property {string} token
 * @property {string} refreshtoken
 */

/**
 * @typedef {object} RegisterDataType
 * @property {UserCollection["schema"]["username"]} username
 * @property {UserCollection["schema"]["email"]} email
 * @property {UserCollection["schema"]["password"]} password
 */

module.exports = class AuthService {
    /**
     *
     * @param {import("./UserService")} UserService
     * @param {import("./EmailService")} EmailService
     */
    constructor(UserService, EmailService) {
        this.UserService = UserService;
        this.EmailService = EmailService;
    }

    /**
     * Find a refresh token
     * @param {import("mongodb").Filter<RefreshTokensCollection["schema"]} filter
     * @returns {Promise<RefreshTokensCollection["schema"]>}
     */
    async findRefreshToken(filter) {
        try {
            return await RefreshTokensCollection.findOne(filter);
        } catch (err) {
            throw createError(404, "Refresh token not found");
        }
    }

    /**
     * Register a new user
     * @param {RegisterDataType} data
     * @returns {Promise<UserCollection["schema"]>}
     */
    async register(data) {
        // Validate data
        try {
            data = SuperUtils.Obj2Schema.compare(
                data,
                {
                    username: UserCollection.schema.username,
                    email: UserCollection.schema.email,
                    password: UserCollection.schema.password,
                },
                {
                    strictMode: {
                        strictType: true,
                        strictNull: true,
                        strictUndefined: true,
                    },
                }
            );
        } catch (err) {
            throw createError(400, "Bad Request");
        }
        // Check to make sure the email and username don't already exist
        const findByUsername = await this.UserService.find({
            username: data.username,
        });
        if (findByUsername && findByUsername._id) {
            throw createError(409, "Username already exists");
        }
        const findByEmail = await this.UserService.find({ email: data.email });
        if (findByEmail && findByEmail._id) {
            throw createError(409, "Email already exists");
        }

        // Encrypt password
        try {
            data.password = crypto.hash.create(
                crypto.base64.decode(data.password)
            );
        } catch (err) {
            throw createError(400, "Password is not encoded with Base64");
        }

        const user = await this.UserService.create(data);
        // Send the user an email to verify their account
        await this.EmailService.create(user._id);
        return user;
    }

    /**
     * Login as a user
     * @param {string} username username or email
     * @param {string} password
     * @returns {Promise<ReturnLoginType>}
     */
    async login(username, password) {
        // Find the user by username or email
        const user = await this.UserService.find({
            $or: [{ username }, { email: username }],
        });
        if (!user || user._id === undefined) {
            throw createError(404, "User not found");
        }

        try {
            // Validate the user's password
            if (
                !crypto.hash.compare(
                    crypto.base64.decode(password),
                    user.password
                )
            ) {
                throw createError(401, "Unauthorized");
            }
        } catch (err) {
            if (err.status) {
                throw err;
            }
            throw createError(400, "Password not encoded with Base64");
        }

        // Create the tokens
        const jwtToken = jwt.sign(
            {
                userid: user._id,
                userWhenSigned: user,
            },
            crypto.options.jwtkey,
            { algorithm: "HS512", expiresIn: "15m" }
        );
        const reToken = crypto.refreshtoken.create(
            user._id + new Date().toString()
        );
        try {
            RefreshTokensCollection.insertOne({
                _id: reToken,
                userid: user._id,
                createdAt: new RefreshTokensCollection.schema.createdAt(),
            });
        } catch (err) {
            throw createError(500, "Internal Server Error");
        }

        return {
            user,
            token: jwtToken,
            refreshtoken: reToken,
        };
    }

    /**
     * Refresh a users tokens
     * @param {string} token
     * @returns {ReturnLoginType}
     */
    async refreshtoken(token) {
        // Find the token
        const findToken = await this.findRefreshToken({ _id: token });
        if (!findToken || findToken._id === undefined) {
            throw createError(404, "Refresh token not found");
        }
        // Find the user
        const findUser = await this.UserService.find({
            _id: findToken.userid,
        });
        if (!findUser || findUser._id === undefined) {
            throw createError(404, "User not found");
        }

        // Create the tokens
        const jwtToken = jwt.sign(
            {
                userid: findUser._id,
                userWhenSigned: findUser,
            },
            crypto.options.jwtkey,
            { algorithm: "HS512", expiresIn: "15m" }
        );
        const reToken = crypto.refreshtoken.create(
            findUser._id + new Date().toString()
        );
        try {
            RefreshTokensCollection.insertOne({
                _id: reToken,
                userid: findUser._id,
                createdAt: new RefreshTokensCollection.schema.createdAt(),
            });
        } catch (err) {
            throw createError(500, "Internal Server Error");
        }

        return {
            user,
            token: jwtToken,
            refreshtoken: reToken,
        };
    }

    /**
     * Log a user out
     * @param {string} reToken
     */
    async logout(reToken) {
        // Find the token
        const findToken = await this.findRefreshToken({ _id: reToken });
        if (!findToken || findToken._id === undefined) {
            throw createError(404, "Refresh token not found");
        }
        // Find the user
        const findUser = await this.UserService.find({
            _id: findToken.userid,
        });
        if (!findUser || findUser._id === undefined) {
            throw createError(404, "User not found");
        }

        // Delete refresh_token
        try {
            await RefreshTokensCollection.deleteOne({
                _id: findToken._id,
                userid: findUser._id,
            });
        } catch (err) {
            throw createError(500, "Internal Server Error");
        }
    }
};
