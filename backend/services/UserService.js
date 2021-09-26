const { Utils: SuperUtils } = require("@forbidden_duck/super-mongo");
const createError = require("http-errors");
const {
    __collections: { users: UserCollection },
} = require("../db");

module.exports = class UserService {
    /**
     * Find a user
     * @param {import("mongodb").Filter<UserCollection["schema"]>} filter
     * @returns {Promise<UserCollection["schema"]>}
     */
    async find(filter) {
        try {
            return (await UserCollection.find(filter, { limit: 1 }))[0];
        } catch (err) {
            throw createError(404, "User not found");
        }
    }

    /**
     * Find many users
     * @param {import("mongodb").Filter<UserCollection["schema"]>} filter
     * @returns {Promise<UserCollection["schema"]>}
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
        data.createdAt = new Date();
        data.modifiedAt = new Date();

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
            throw createError(500, "Failed to find the IP after insertion");
        }
        return updatedDoc;
    }

    /**
     * Delete a user
     * @param {import("mongodb").Filter<UserCollection["schema"]>} filter
     * @returns {Promise<boolean>}
     */
    async delete(filter) {
        // Check the document exists
        const findDoc = await this.find(filter);
        if (!findDoc || findDoc._id === undefined) {
            throw createError(404, "IP not found");
        }

        try {
            await UserCollection.deleteOne(filter);
        } catch (err) {
            throw createError(500, err.message);
        }

        // Check the document was deleted
        const deletedDoc = await this.find(filter);
        return !!(deletedDoc && deletedDoc._id);
    }
};
