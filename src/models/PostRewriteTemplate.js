const { generateUniqueId } = require("../helper");

/*
Lead schema
*/
const mongoose = require("mongoose");
require("../index");


const {Schema} = mongoose;

const PostRewriteTemplateSchema = new Schema({
	id: {
		type: String
	},
    post_rewrite_templates: {
		type: Array
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

const PostRewriteTemplates = mongoose.model("PostRewriteTemplates", PostRewriteTemplateSchema);
module.exports = PostRewriteTemplates;


