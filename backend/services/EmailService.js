const { Utils: SuperUtils } = require("@forbidden_duck/super-mongo");
const createError = require("http-errors");
const {
    __collections: { emailverification: EmailCollection },
} = require("../db");

module.exports = class EmailService {
    /**
     *
     * @param {import("./UserService")} UserService
     */
    constructor(UserService) {
        this.UserService = UserService;
        this.transport = require("@sendgrid/mail");
        this.transport.setApiKey(process.env.SENDGRIDAPIKEY);
    }

    /**
     * Create a new Email Verification token
     * @param {string} userid
     * @returns {Promise<EmailCollection["schema"]>}
     */
    create(userid) {
        return new Promise(async (resolve, reject) => {
            // Check the user exists
            const findUser = await this.UserService.find({ _id: userid });
            if (!findUser || findUser._id === undefined) {
                throw createError(404, "User not found");
            }

            // Make sure the user isn't verified
            if (findUser.verified) {
                throw createError(403, "User already verified");
            }
            // Delete all verification requests when creating a new one
            await EmailCollection.deleteMany({ userid });

            /**
             * @type {EmailCollection["schema"]}
             */
            const data = {
                _id: SuperUtils.ID.create("SHA256"),
                userid,
                token: SuperUtils.Token.create("SHA512", userid),
                createdAt: new Date(),
            };

            try {
                await EmailCollection.insertOne(data);
            } catch (err) {
                throw createError(500, err.message);
            }

            // Check the document was inserted
            const insertedDoc = await EmailCollection.findOne({
                _id: data._id,
            });
            if (!insertedDoc || insertedDoc._id === undefined) {
                throw createError(
                    500,
                    "Failed to find the email verification after insertion"
                );
            }

            // Send email
            this.transport
                .send({
                    to: findUser.email,
                    from: "mongo-web-app@harrisonhoward.xyz",
                    subject: "[No-reply] Verify your email",
                    text: `Hello ${findUser.username}, Click here to verify your account`,
                    html:
                        `Hello ${findUser.username},<br />` +
                        `<a href="${process.env.EMAILGOTO}/${insertedDoc.token}">Click here</a> to verify your account<br /><br />` +
                        `Regards,<br />` +
                        `Mongo Web App <em>(Please do not reply to this email)</em>`,
                })
                .then(() => resolve(insertedDoc))
                .catch((err) => reject(createError(500, err.message)));
        });
    }

    /**
     * Verify the token is correct
     * @param {string} userid
     * @param {string} token
     * @returns {Promise<boolean>}
     */
    async verify(userid, token) {
        // Check the user exists
        const findUser = await this.UserService.find({ _id: userid });
        if (!findUser || findUser._id === undefined) {
            throw createError(404, "User not found");
        }
        const findDoc = await EmailCollection.findOne({ userid, token });
        const docWasFound = !!(findDoc && findDoc._id);
        if (docWasFound) {
            await EmailCollection.deleteOne({ _id: findDoc._id });
            this.UserService.update(
                { $set: { verified: true } },
                { _id: userid }
            );
        }
        return docWasFound;
    }
};
