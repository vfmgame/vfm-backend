/*
Game schema
*/
const mongoose = require("mongoose");
require("../index");


const {Schema} = mongoose;

const GameSchema = new Schema({
    id: {
        type: String,
        unique: true
    },
    userId: {
        type: String,
        unique: true
    },
    paused: {
        type: Boolean,
        default: false
    },
    scores: {
        type: Number,
        require: 0
    },
    minute: {
        type: Number,
        default: 0
    },
    seconds: {
        type: Number,
        default: 0
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    updated_at: {
        type: Date,
        default: Date.now()
    }
});

GameSchema.methods.toJSON = function () {
    let gameObject = this.toObject();
    delete gameObject.__v;
    delete gameObject._id;
    return gameObject;
};

const Games = mongoose.model("Games", GameSchema);
module.exports = Games;