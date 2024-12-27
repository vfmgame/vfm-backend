const { generateUniqueId } = require("../helper");

/*
Carousel schema
*/
const mongoose = require("mongoose");
require("../index");

const {Schema} = mongoose;

const WorkspaceSchema = new Schema({
	id: {
        type: String,
        unique: true
    },
	name: {
		type: String
	},
	members_count: {
		type: Number,
		default: 0
	},
    is_archived: {
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

const Workspaces = mongoose.model("Workspaces", WorkspaceSchema);
module.exports = Workspaces;

