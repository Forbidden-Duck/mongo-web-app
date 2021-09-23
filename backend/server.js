// Clear for start
console.clear();
// Load environment variables
require("dotenv").config(".env");

const app = require("express")();
const https = require("https"); // For HTTPS protocol server
// TODO Loaders
const PORT = parseInt(process.env.PORT || 6001);

(async () => {
    // TODO await loaders
    if (process.env.PROTOCOL === "https") {
        const fs = require("fs");
        https
            .createServer(
                {
                    key: fs.readFileSync(__dirname + "/../cert/key.pem"),
                    cert: fs.readFileSync(__dirname + "/../cert/cert.pem"),
                },
                app
            )
            .listen(PORT);
        console.log(`Server listening on https/${PORT}`);
    } else {
        app.listen(PORT, (err) => {
            if (err) {
                console.log("Error while listening for connections\n", err);
                process.exit(0);
            }
            console.log(`Server listening on http/${PORT}`);
        });
    }
})();
