/*
Transaction schema
*/
const mongoose = require("mongoose");
require("../index");


const {Schema} = mongoose;

const TransactionSchema = new Schema({
    id: {
        type: String,
        unique: true
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        unique: true
    },
    reward: {
        type: Object,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
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
TransactionSchema.methods.toJSON = function () {
    let transactionObject = this.toObject();
    delete transactionObject.__v;
    delete transactionObject._id;
    return transactionObject;
};

const Transactions = mongoose.model("Transactions", TransactionSchema);
module.exports = Transactions;