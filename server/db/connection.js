const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

const conn = mongoose
  .connect(process.env.ATLAS_URL)
  .then((db) => {
    console.log("Database Connected");
    return db;
  })
  .catch((err) => {
    console.log("Connection Error");
  });

module.exports = conn;
