const { generateUniqueId } = require("../helper");

/*
Carousel schema
*/
const mongoose = require("mongoose");
require("../index");

const {Schema} = mongoose;

const RoleSchema = new Schema({
	id: {
        type: String,
        unique: true
    },
	name: {
		type: String,
        required: true
	},
    description: {
		type: String,
        require: true
	},
	permissions: {
		type: Array,
		required: true
	},
    url_permissions: {
		type: Object,
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

const Roles = mongoose.model("Roles", RoleSchema);
module.exports = Roles;

