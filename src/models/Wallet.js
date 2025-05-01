/*
Wallet schema
*/
const { required } = require("joi");
const mongoose = require("mongoose");
require("../index");


const {Schema} = mongoose;

const WalletSchema = new Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        unique: true,
    },
    totalFiatValue: {
        type: Object,
        default: {
            "usd": 0
        }
    },
    points: {
        type: Array,
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
});
WalletSchema.methods.toJSON = function () {
    let walletObject = this.toObject();
    delete walletObject.__v;
    delete walletObject._id;
    delete walletObject.userId;
    return walletObject;
};

const Wallets = mongoose.model("Wallets", WalletSchema);
module.exports = Wallets;