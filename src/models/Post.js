const { generateUniqueId } = require("../helper");

/*
Lead schema
*/
const mongoose = require("mongoose");
require("../index");


const {Schema} = mongoose;

const PostSchema = new Schema({
	id: {
		type: String,
		unique: true
	},
    creator_id: {
		type: String,
        ref: "User"
	},
	workspace_id: {
		type: String,
        ref: "Workspace"
	},
    published_id: {
		type: String
	},
    auto_plug_comment: {
		type: String
	},
	carousel_title: {
		type: String,
		default: null
	},
	text: {
		type: String
	},
    image_url: {
		type: String
	},
    mentions: {
		type: Array,
		default: []
	},
    rich_text: {
		type: Object
	},
    file_url: {
		type: String
	},
    video_url: {
		type: String,
		default: null
	},
    video_title: {
		type: String,
		default: null
	},
    linked_in_account_id: {
		type: String
	},
    linked_in_account: {
		type: Object,
	},
    linkedin_api_response: {
		type: String
	},
    publishing_error: {
		type: String
	},
	time_slot_instance: {
		type: Object,
		default: null
	},
	time_slot_instance_id: {
		type: String,
		default: null
	},
	status: {
		type: String,
		enum: ["draft", "published", "failed", "scheduled", "in_progress"],
		default: "draft",
	},
    published_at: {
		type: Date
	},
	published_url: {
		type: String
	},
	user: {
		type: String
	},
	scheduled_at: {
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

const Posts = mongoose.model("Posts", PostSchema);
module.exports = Posts;
