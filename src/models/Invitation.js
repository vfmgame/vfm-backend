const { generateUniqueId } = require("../helper");

/*
Carousel schema
*/
const mongoose = require("mongoose");
require("../index");

const {Schema} = mongoose;

const InvitationSchema = new Schema({
	id: {
        type: String,
        unique: true
    },
	creator_id: {
		type: String,
        ref: "Account"
	},
	email: {
		type: String,
        ref: "User"
	},
	name: {
		type: String
	},
	from_name: {
		type: String,
        ref: "User"
	},
	from_email: {
		type: String,
        ref: "User"
	},
    role_id: {
		type: String
	},
	role: {
		type: String
	},
	workspace_name: {
		type: String
	},
	workspace_id: {
		type: String
	},
	accepted: {
		type: Boolean,
		default: false
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

const Invitations = mongoose.model("Invitations", InvitationSchema);
module.exports = Invitations;

