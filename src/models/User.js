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
	name: {
		type: String,
		trim: true
	},
	username: {
		type: String,
		unique: 'Two users cannot share the same email ({VALUE})',
		trim: true,
		required: true
	},
	last_login: {
		type: Date,
		require: false
	},
	refresh_token: {
		type: String,
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
