const { generateUniqueId } = require("../helper");

/*
Carousel schema
*/
const mongoose = require("mongoose");
require("../index");

const {Schema} = mongoose;

const ContentWritingSchema = new Schema({
	id: {
        type: String,
        unique: true
    },
    workspace_id: {
		type: String
	},
	name: {
		type: String
	},
	posts: {
		type: Array
	},
    status: {
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

const ContentWritings = mongoose.model("ContentWritings", ContentWritingSchema);
module.exports = ContentWritings;

