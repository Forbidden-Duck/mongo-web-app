const { Utils: SuperUtils } = require("@forbidden_duck/super-mongo");
const createError = require("http-errors");
const {
    __collections: {
        users: UserCollection,
        refresh_tokens: RefreshTokenCollection,
    },
} = require("../db");
const crypto = require("../crypto");

module.exports = class UserService {
    /**
     *
     * @param {import("./DBService")} DBService
     * @param {import("./EmailService")} EmailService
     */
    constructor(DBService, EmailService) {
        this.DBService = DBService;
        this.EmailService = EmailService;
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
     * @param {import("mongodb").UpdateFilter<UserCollection["schema"] & { currentPassword: string }>} data
     * @param {import("mongodb").Filter<UserCollection["schema"] & { currentPassword: string }>} filter
     * @returns {Promise<UserCollection["schema"]>}
     */
    async update(data, filter) {
        // Validate data
        try {
            data = SuperUtils.Operations.UpdateFilter(
                data,
                {
                    ...UserCollection.schema,
                    currentPassword: UserCollection.schema.password,
                },
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
        // Check to make sure the email and username don't already exist
        if (data.$set.username) {
            if (data.$set.username === findDoc.username) {
                throw createError(
                    409,
                    `Your username is already "${data.$set.username}"`
                );
            }
            const findByUsername = await this.find({
                username: data.$set.username,
            });
            if (findByUsername && findByUsername._id) {
                throw createError(409, "Username already exists");
            }
        }
        if (data.$set.email) {
            if (data.$set.email === findDoc.email) {
                throw createError(
                    409,
                    `Your email is already "${data.$set.username}"`
                );
            }
            const findByEmail = await this.find({ email: data.$set.email });
            if (findByEmail && findByEmail._id) {
                throw createError(409, "Email already exists");
            }
            // Ensure verify is set to false
            data.$set.verified = false;
        }

        if (data.$set.password) {
            if (!data.$set.currentPassword) {
                throw createError(
                    400,
                    "Changing password requires the current password"
                );
            } else {
                try {
                    if (
                        !crypto.hash.compare(
                            crypto.base64.decode(data.$set.currentPassword),
                            findDoc.password
                        )
                    ) {
                        throw createError(401, "Unauthorized");
                    }
                } catch (err) {
                    if (err.status === 401) throw err;
                    throw createError(
                        400,
                        "Current password is not encoded with Base64"
                    );
                }
            }
            // Ensure the account is verified
            if (!findDoc.verified && data.$set.verified !== true) {
                throw createError(
                    403,
                    "You must have a verified email before changing your password"
                );
            }
            // Encrypt password
            try {
                data.$set.password = crypto.hash.create(
                    crypto.base64.decode(data.$set.password)
                );
            } catch (err) {
                throw createError(400, "Password is not encoded with Base64");
            }
        }

        // Ensure modifiedAt is updated accordingly
        if (!data.$set) data.$set = {};
        data.$set["modifiedAt"] = new Date();

        try {
            await UserCollection.updateOne(data, filter);
        } catch (err) {
            throw createError(500, err.message);
        }

        if (data.$set.email) {
            // Send a new verification email
            await this.EmailService.create(findDoc._id);
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
                !crypto.hash.compare(
                    crypto.base64.decode(password),
                    findDoc.password
                )
            ) {
                throw createError(401, "Unauthorized");
            }
        } catch (err) {
            if (err.status === 401) throw err;
            throw createError(400, "Password is not encoded with Base64");
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
        // Delete all refresh tokens for that user
        await RefreshTokenCollection.deleteMany({ userid: findDoc._id });

        // Check the document was deleted
        const deletedDoc = await this.find(filter);
        return !!(!deletedDoc || deletedDoc._id === undefined);
    }
};
