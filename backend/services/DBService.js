const { Utils: SuperUtils } = require("@forbidden_duck/super-mongo");
const createError = require("http-errors");
const {
    __collections: { saveddbs: DBCollection },
} = require("../db");
const crypto = require("../crypto");

module.exports = class DBService {
    /**
     *
     * @param {import("./UserService")} UserService
     */
    constructor(UserService) {
        this.UserService = UserService;
    }

    /**
     * Find a saved database
     * @param {import("mongodb").Filter<DBCollection["schema"]>} filter
     * @returns {Promise<DBCollection["schema"]>}
     */
    async find(filter) {
        try {
            return await DBCollection.findOne(filter);
        } catch (err) {
            throw createError(404, "DB not found");
        }
    }

    /**
     * Find many saved databases
     * @param {import("mongodb").Filter<DBCollection["schema"]>} filter
     * @returns {Promise<DBCollection["schema"][]>}
     */
    async findMany(filter) {
        try {
            return await DBCollection.find(filter);
        } catch (err) {
            throw createError(404, "DBs not found");
        }
    }

    /**
     * Save a new database
     * @param {DBCollection["schema"]} data
     * @returns {Promise<DBCollection["schema"]>}
     */
    async create(data) {
        // Check user exists
        const findUser = await this.UserService.find({ _id: data.userid });
        if (!findUser || findUser._id === undefined) {
            throw createError(404, "User not found");
        }

        data._id = SuperUtils.ID.create("SHA256");
        data.createdAt = new DBCollection.schema.createdAt();
        data.modifiedAt = null;

        if (data.password) {
            // Decode password
            try {
                data.password = SuperUtils.Base64.decode(data.password);
            } catch (err) {
                throw createError(400, "Password is not encoded with Base64");
            }
        }

        try {
            await DBCollection.insertOne(data);
        } catch (err) {
            throw createError(500, err.message);
        }

        // Check the document was inserted
        const insertedDoc = await this.find({ _id: data._id });
        if (!insertedDoc || insertedDoc._id === undefined) {
            throw createError(500, "Failed to find the DB after insertion");
        }
        return insertedDoc;
    }

    /**
     * Update saved db data
     * @param {import("mongodb").UpdateFilter<DBCollection["schema"]>} data
     * @param {import("mongodb").Filter<DBCollection["schema"]>} filter
     * @returns {Promise<DBCollection["schema"]>}
     */
    async update(data, filter) {
        // Validate data
        try {
            data = SuperUtils.Operations.UpdateFilter(
                data,
                DBCollection.schema,
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
            throw createError(404, "DB not found");
        }
        if (data.$set.userid) {
            // Check user exists
            const findUser = await this.UserService.find({
                _id: data.$set.userid,
            });
            if (!findUser || findUser._id === undefined) {
                throw createError(404, "User not found");
            }
        }

        // Ensure modifiedAt is updated accordingly
        if (!data.$set) data.$set = {};
        data.$set["modifiedAt"] = new Date();

        if (data.password) {
            // Decode password
            try {
                data.password = SuperUtils.Base64.decode(data.password);
            } catch (err) {
                throw createError(400, "Password is not encoded with Base64");
            }
        }

        try {
            await DBCollection.updateOne(data, filter);
        } catch (err) {
            throw createError(500, err.message);
        }

        // Check the document was updated
        const updatedDoc = await this.find(filter);
        if (!updatedDoc || updatedDoc._id === undefined) {
            throw createError(500, "Failed to find the DB after insertion");
        }
        return updatedDoc;
    }

    /**
     * Delete a saved db
     * @param {import("mongodb").Filter<DBCollection["schema"]>} filter
     * @returns {Promise<boolean>}
     */
    async delete(filter) {
        // Check the document exists
        const findDoc = await this.find(filter);
        if (!findDoc || findDoc._id === undefined) {
            throw createError(404, "DB not found");
        }

        try {
            await DBCollection.deleteOne(filter);
        } catch (err) {
            throw createError(500, err.message);
        }

        // Check the document was deleted
        const deletedDoc = await this.find(filter);
        return !!(deletedDoc && deletedDoc._id);
    }
};
