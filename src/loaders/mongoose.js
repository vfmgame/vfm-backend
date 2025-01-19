const mongoose = require("mongoose");
const Secrets = require("../config");


module.exports = async () => {
  mongoose.set('strictQuery', true);
  await mongoose.connect(Secrets.DATABASE_LIVE_URL, { useNewUrlParser: true, })
  .then(() => console.log("Connect Successful"))
  .catch((err) => console.error("Could not connect" + err));
}