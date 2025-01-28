const mongoose = require("mongoose");
const Secrets = require("../config");


module.exports = async () => {
  //mongoose.set('strictQuery', true);
  await mongoose.connect("mongodb+srv://essien:Coding3719.@cluster0.ygjpk.mongodb.net/vfm?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("Connect Successful"))
  .catch((err) => console.error("Could not connect" + err));
}