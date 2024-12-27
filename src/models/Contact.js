const { generateUniqueId } = require("../helper");

/*
Carousel schema
*/
const mongoose = require("mongoose");
require("../index");

const {Schema} = mongoose;

const ContactSchema = new Schema({
	id: {
        type: String,
        unique: true
    },
	list_id: {
		type: String,
		trim: true,
        required: true
	},
    name: {
		type: String
	},
    avatar_url: {
		type: String,
		trim: true
	},
	profile_url: {
		type: String,
		required: true
	},
    external_linked_in_profile_id: {
		type: String,
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

const Contacts = mongoose.model("Contacts", ContactSchema);
module.exports = Contacts;

