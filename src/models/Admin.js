/*
Admin schema
*/
const mongoose = require("mongoose");
require("../index");


const {Schema} = mongoose;

const AdminSchema = new Schema({
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
});

AdminSchema.methods.toJSON = function () {
    let adminObject = this.toObject();
    delete adminObject.__v;
    return adminObject;
};


const Admins = mongoose.model("Admins", AdminSchema);
module.exports = Admins;