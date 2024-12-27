const { generateUniqueId } = require("../helper");

/*
Carousel schema
*/
const mongoose = require("mongoose");
require("../index");

const {Schema} = mongoose;

const UserWorkspaceSchema = new Schema({
	id: {
        type: String,
        unique: true
    },
	creator_id: {
		type: String
	},
    workspace_id: {
		type: String
	},
    role_id: {
		type: String
	},
    is_default: {
		type: Boolean,
        default: true
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

const UserWorkspaces = mongoose.model("UserWorkspaces", UserWorkspaceSchema);
module.exports = UserWorkspaces;

