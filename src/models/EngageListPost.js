const { generateUniqueId } = require("../helper");

/*
EngageListPost schema
*/
const mongoose = require("mongoose");
require("../index");

const {Schema} = mongoose;

const EngageListPostSchema = new Schema({
	id: {
        type: String,
        unique: true
    },
	text: {
        type: String
    },
	likes_count: {
        type: Number,
		default: null
    },
	comments_count: {
        type: Number,
		default: null
    },
	reposts_count: {
        type: Number,
		default: 0
    },
	linked_in_profile_id: {
        type: String
    },
	external_linked_in_post_id: {
        type: String
    },
	media_urls: {
        type: Array
    },
	links: {
        type: String
    },
	applause_count: {
        type: Number
    },
	support_count: {
        type: Number
    },
	love_count: {
        type: Number
    },
	interest_count: {
        type: Number
    },
	laugh_count: {
        type: Number
    },
	external_linked_in_post_url: {
        type: String
    },
	linked_in_profile: {
        type: Object
    },
	list_post_id: {
        type: String
    },
	contact_post_comment: {
		type: String
	},
	published_at: {
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

const EngageListPosts = mongoose.model("EngageListPosts", EngageListPostSchema);
module.exports = EngageListPosts;
