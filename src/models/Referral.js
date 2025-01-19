const { required } = require("joi");
const { generateUniqueId } = require("../helper");

/*
Referral schema
*/
const mongoose = require("mongoose");
require("../index");


const {Schema} = mongoose;

const ReferralSchema = new Schema({
    id: {
        type: String,
        unique: true
    },
    creatorId: {
        type: String,
        unique: true
    },
    referrerId: {
        type: String,
        required: true
    },
    avatar: {
		type: String
	},
    firstname: {
        type: String,
        trim: true,
        required: true
    },
    lastname: {
        type: String,
        trim: true,
        required: true
    },
    nickname: {
        type: String,
        trim: true,
        required: true
    },
    point: {
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

const Referrals = mongoose.model("Referrals", ReferralSchema);
module.exports = Referrals;
