const { generateUniqueId } = require("../helper");

/*
Lead schema
*/
const mongoose = require("mongoose");
require("../index");


const {Schema} = mongoose;

const RewriteTemplateSchema = new Schema({
	id: {
		type: String
	},
    name: {
		type: String
	},
    logo_url: {
		type: String
	},
    prompt_template: {
		type: String
	},
    is_active: {
		type: Boolean,
        default: true
	},
    visibility: {
		type: String
	},
    sort_order: {
		type: String
	},
    is_new: {
		type: Boolean
	},
    is_beta: {
		type: Boolean
	},
    parent_id: {
		type: String
	},
    post_rewrite_template_group_id: {
		type: String
	},
    template_type: {
		type: String
	},
    children: {
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

const RewriteTemplates = mongoose.model("RewriteTemplates", RewriteTemplateSchema);
module.exports = RewriteTemplates;


