const { generateUniqueId } = require("../helper");

/*
OTP schema
*/
const mongoose = require("mongoose");
require("../index");


const TokenSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        ref: "User"
    },
    token: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now(),
        expires: 50000,
    },
});


const Tokens = mongoose.model("Tokens", TokenSchema);

module.exports = Tokens;