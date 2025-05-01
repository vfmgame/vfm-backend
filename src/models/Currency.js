/*
Currency schema
*/
const mongoose = require("mongoose");
require("../index");


const {Schema} = mongoose;

const CurrencySchema = new Schema({
    id: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    symbol: {
        type: String,
        required: true
    },
    imageUrl: {
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
CurrencySchema.methods.toJSON = function () {
    let currencyObject = this.toObject();
    delete currencyObject.__v;
    delete currencyObject._id;
    return currencyObject;
};

const Currencies = mongoose.model("Currencies", CurrencySchema);
module.exports = Currencies;