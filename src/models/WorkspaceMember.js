const { generateUniqueId } = require("../helper");

/*
Carousel schema
*/
const mongoose = require("mongoose");
require("../index");

const {Schema} = mongoose;

const WorkspaceMemberSchema = new Schema({
	id: {
        type: String,
        unique: true
    },
	workspace_id: {
		type: String
	},
	user_id: {
		type: String
	},
    role_id: {
		type: String
	},
    name: {
		type: String
	},
    email: {
		type: String
	},
    role: {
		type: String
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

const WorkspaceMembers = mongoose.model("WorkspaceMembers", WorkspaceMemberSchema);
module.exports = WorkspaceMembers;

