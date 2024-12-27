const { generateUniqueId } = require("../helper");

/*
Carousel schema
*/
const mongoose = require("mongoose");
require("../index");

const {Schema} = mongoose;

const LinkedinAccountSchema = new Schema({
	creator_id: {
		type: String
	},
	user_id: {
		type: String
	},
    workspace_id: {
		type: String
	},
	avatar_url: {
		type: String
	},
    name: {
		type: String
	},
	email: {
		type: String
	},
	scope: {
		type: String
	},
	access_token: {
		type: String
	},
	expires_in: {
		type: Number
	},
	refresh_token: {
		type: String
	},
	reconnection_needed: {
		type: Boolean
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

const LinkedinAccounts = mongoose.model("LinkedinAccounts", LinkedinAccountSchema);
module.exports = LinkedinAccounts;

