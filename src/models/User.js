const { required } = require("joi");
const { generateUniqueId } = require("../helper");

/*
User schema
*/
const mongoose = require("mongoose");
require("../index");


const {Schema} = mongoose;

const UserSchema = new Schema({
	id: {
        type: String,
        unique: true
    },
	userId: {
        type: String,
        unique: true
    },
	name: {
		type: String,
		trim: true
	},
	nickname: {
		type: String,
		unique: 'Two users cannot share the same nickname ({VALUE})',
		trim: true,
		required: true
	},
	claim: {
		type: Number,
		default: 0
	},
	last_login: {
		type: Date,
		require: false
	},
	referrer: {
		type: String,
		required: false
	},
	referral_earnings: {
		type: Number,
		default: 0,
		required: false
	},
	referral_profit: {
		type: Number,
		default: 0,
		required: false
	},
	referral_code: {
		type: String,
		required: false
	},
	wallet: {
		type: Number,
		default: 0,
		required: false
	},
	RESET_TOKEN: {
		type: String,
		required: false
	},
	RESET_TOKEN_TTL: {
		type: Date,
		required: false
	},
	claimed_bonus: {
		type: Boolean,
		default: false
	},
	user_verified: {
		type: Boolean,
		default: false
	},
	user_verified_at: {
		type: Date
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

const Users = mongoose.model("Users", UserSchema);
module.exports = Users;
