// Parsers and security
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");

// Rate-limit
const expressRateLimit = require("express-rate-limit");
const mongoRateLimit = require("rate-limit-mongo");
const rateLimitExpiry = 15 * 60 * 1000; // 15 minutes

// Production
const express = require("express");
const path = require("path");

// Logging
const onHeaders = require("on-headers");
const onFinished = require("on-finished");
const moment = require("moment");

/**
 *
 * @param {express.Express} app
 * @returns {express.Express}
 */
module.exports = (app) => {
    app.use(cors({ credentials: true, origin: true }));
    app.use(
        helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: [
                        "'self'",
                        "https://fonts.googleapis.com",
                        "'unsafe-inline'",
                    ],
                    imgSrc: ["'self'", "data:"],
                    fontSrc: ["'self'", "https://fonts.gstatic.com"],
                },
            },
        })
    );
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.set("trust proxy", 1);
    app.use(
        new expressRateLimit({
            store: new mongoRateLimit({
                uri: `mongodb://${process.env.DBADDRESS}/${process.env.DBHOST}`,
                collectionName: "rate-limit",
                user: process.env.DBUSERNAME,
                password: process.env.DBPASSWORD,
                expireTimeMs: rateLimitExpiry,
            }),
            windowMs: rateLimitExpiry,
            max: 1500,
            keyGenerator: (req) => req.ip.replace(/((?::))(?:[0-9]+)$/, ""),
        })
    );
    // Logging
    app.use((req, res, next) => {
        function padString(str, len = 0) {
            while (str.length < len) {
                str += " ";
            }
            return str;
        }

        const requestStart = process.hrtime();
        let responseStart = [0, 0];

        onHeaders(res, () => {
            responseStart = process.hrtime();
        });
        onFinished(res, () => {
            const url = req.originalUrl || req.url;
            const colour =
                res.statusCode >= 500
                    ? 31 // Red
                    : res.statusCode >= 400
                    ? 33 // Gold
                    : res.statusCode >= 300
                    ? 36 // Cyan
                    : res.statusCode >= 200
                    ? 32 // Green
                    : 0; // None
            const status = `\x1b[${colour}m${res.statusCode}\x1b[0m`;
            const responseTime =
                (responseStart[0] - requestStart[0]) * 1e3 +
                (responseStart[1] - requestStart[1]) * 1e-6;

            const lines = [
                padString(moment().format("DD/MM/YYYY h:mma"), 18),
                `${padString(req.method, 6)} ${padString(url, 80)} ${status}`,
                `${responseTime.toFixed(3)} ms`,
                req.ip,
            ];
            console.log(`\x1b[0m${lines.join(" | ")}\x1b[0m`);
        });
        next();
    });
    if (process.env.NODE_ENV === "production") {
        app.use(
            express.static(path.resolve(__dirname, "../../frontend/build"))
        );
    }
    return app;
};
