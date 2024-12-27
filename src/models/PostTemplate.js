const { generateUniqueId } = require("../helper");

/*
Carousel schema
*/
const mongoose = require("mongoose");
require("../index");

const {Schema} = mongoose;

const PostTemplateSchema = new Schema({
	id: {
        type: String,
        unique: true
    },
	external_id: {
		type: String
	},
    title: {
		type: String
	},
    description: {
		type: String
	},
	is_beta: {
		type: Boolean,
		default: false
	},
    is_new: {
		type: Boolean,
		default: false
	},
    image_url: {
		type: String,
	},
    prompt_template: {
		type: String,
	},
    sort_order: {
		type: Number,
	},
    visibility: {
		type: String,
	},
    user_input_fields: {
		type: Array,
	},
    post_formats: {
		type: Object
	},
    active: {
		type: Boolean,
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

const PostTemplates = mongoose.model("PostTemplates", PostTemplateSchema);
module.exports = PostTemplates;

