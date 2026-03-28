/**
 * Manual one-off: from server/ run: node test/data/mongo/index.js
 * Loads .env from server/.env and resets DB from PlaylisterData.json
 */
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
const mongoose = require("mongoose");
const { seedDatabaseReset } = require("../../db/seedFromFixture");

mongoose
  .connect(process.env.DB_CONNECT)
  .then(() => seedDatabaseReset())
  .then(() => {
    console.log("Done. Exiting.");
    process.exit(0);
  })
  .catch((e) => {
    console.error("Connection or seed error:", e.message);
    process.exit(1);
  });
