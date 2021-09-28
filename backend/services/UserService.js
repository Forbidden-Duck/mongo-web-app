const { Utils: SuperUtils } = require("@forbidden_duck/super-mongo");
const createError = require("http-errors");
const {
    __collections: { users: UserCollection },
} = require("../db");
const crypto = require("../crypto");

module.exports = class UserService {
    /**
     *
     * @param {import("./DBService")} DBService
     */
    constructor(DBService) {
        this.DBService = DBService;
    }

    /**
     * Find a user
     * @param {import("mongodb").Filter<UserCollection["schema"]>} filter
     * @returns {Promise<UserCollection["schema"]>}
     */
    async find(filter) {
        try {
            return await UserCollection.findOne(filter);
        } catch (err) {
            throw createError(404, "User not found");
        }
    }

    /**
     * Find many users
     * @param {import("mongodb").Filter<UserCollection["schema"]>} filter
     * @returns {Promise<UserCollection["schema"][]>}
     */
    async findMany(filter) {
        try {
            return await UserCollection.find(filter);
        } catch (err) {
            throw createError(404, "Users not found");
        }
    }

    /**
     * Create a new user
     * @param {UserCollection["schema"]} data
     * @returns {Promise<UserCollection["schema"]>}
     */
    async create(data) {
        data._id = SuperUtils.ID.create("SHA256");
        data.verified = false;
        data.createdAt = new UserCollection.schema.createdAt();
        data.modifiedAt = null;

        try {
            await UserCollection.insertOne(data);
        } catch (err) {
            throw createError(500, err.message);
        }

        // Check the document was inserted
        const insertedDoc = await this.find({ _id: data._id });
        if (!insertedDoc || insertedDoc._id === undefined) {
            throw createError(500, "Failed to find the user after insertion");
        }
        return insertedDoc;
    }

    /**
     * Update user data
     * @param {import("mongodb").UpdateFilter<UserCollection["schema"]>} data
     * @param {import("mongodb").Filter<UserCollection["schema"]>} filter
     * @returns {Promise<UserCollection["schema"]>}
     */
    async update(data, filter) {
        // Validate data
        try {
            data = SuperUtils.Operations.UpdateFilter(
                data,
                UserCollection.schema,
                {
                    strictMode: { strictType: true },
                }
            );
        } catch (err) {
            throw createError(400, "Bad Request");
        }
        // Check the document exists
        const findDoc = await this.find(filter);
        if (!findDoc || findDoc._id === undefined) {
            throw createError(404, "User not found");
        }

        // Ensure modifiedAt is updated accordingly
        if (!data.$set) data.$set = {};
        data.$set["modifiedAt"] = new Date();

        try {
            await UserCollection.updateOne(data, filter);
        } catch (err) {
            throw createError(500, err.message);
        }

        // Check the document was updated
        const updatedDoc = await this.find(filter);
        if (!updatedDoc || updatedDoc._id === undefined) {
            throw createError(500, "Failed to find the user after insertion");
        }
        return updatedDoc;
    }

    /**
     * Delete a user
     * @param {UserCollection["schema"]["password"]} password Password to the specified account
     * @param {import("mongodb").Filter<UserCollection["schema"]>} filter
     * @returns {Promise<boolean>}
     */
    async delete(password, filter) {
        // Check the document exists
        const findDoc = await this.find(filter);
        if (!findDoc || findDoc._id === undefined) {
            throw createError(404, "User not found");
        }

        try {
            // Validate the user's password
            if (
                crypto.hash.compare(
                    crypto.base64.decode(password),
                    findDoc.password
                )
            ) {
                throw createError(401, "Unauthorized");
            }
        } catch (err) {
            throw createError(400, "Bad Request");
        }
        try {
            await UserCollection.deleteOne(filter);
        } catch (err) {
            throw createError(500, err.message);
        }
        // Delete all saveddbs related to the user
        const findDBs = await this.DBService.findMany({ userid: findDoc._id });
        for (const db of findDBs) {
            await this.DBService.delete({ _id: db._id });
        }

        // Check the document was deleted
        const deletedDoc = await this.find(filter);
        return !!(deletedDoc && deletedDoc._id);
    }
};
