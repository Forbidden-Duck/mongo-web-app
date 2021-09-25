const { Utils: SuperUtils } = require("@forbidden_duck/super-mongo");
const createError = require("http-errors");
const {
    __schemas: { ips: IPSchema },
    __collections: { ips: IPCollection },
} = require("../db");

module.exports = class IPService {
    /**
     *
     * @param {IPCollection} ips
     */
    constructor(ips) {
        this.IPCollection = ips;
    }

    /**
     * Find an IP
     * @param {import("mongodb").Filter<IPSchema>} filter
     * @returns {Promise<IPSchema>}
     */
    async find(filter) {
        try {
            return (await this.IPCollection.find(filter, { limit: 1 }))[0];
        } catch (err) {
            throw createError(404, "IP not found");
        }
    }

    /**
     * Create a new IP
     * @param {IPSchema} data
     * @returns {Promise<IPSchema>}
     */
    async create(data) {
        data._id = SuperUtils.ID.create("SHA256");
        data.createdAt = new Date();
        data.modifiedAt = null;

        try {
            await this.IPCollection.insertOne(data);
        } catch (err) {
            throw createError(500, err.message);
        }

        // Check the document was inserted
        const insertedDoc = await this.find({ _id: data._id });
        if (!insertedDoc || insertedDoc._id === undefined) {
            throw createError(500, "Failed to find IP after insertion");
        }
        return insertedDoc;
    }

    /**
     * Update an IP
     * @param {import("mongodb").UpdateFilter<IPSchema>} data
     * @param {import("mongodb").Filter<IPSchema>} filter
     * @returns {Promise<IPSchema>}
     */
    async update(data, filter) {
        // Check the IP exists
        const findDoc = await this.find(filter);
        if (!findDoc || findDoc._id === undefined) {
            throw createError(404, "IP not found");
        }

        // Ensure modifiedAt is updated accordingly
        data.$set["modifiedAt"] = new Date();

        try {
            await this.IPCollection.updateOne(data, filter);
        } catch (err) {
            throw createError(500, err.message);
        }

        // Check the document was updated
        const updatedDoc = await this.find(filter);
        if (!updatedDoc || updatedDoc._id === undefined) {
            throw createError(500, "Failed to find IP after insertion");
        }
        return updatedDoc;
    }
};
