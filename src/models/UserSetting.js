const { generateUniqueId } = require("../helper");

/*
User schema
*/
const mongoose = require("mongoose");
require("../index");


const {Schema} = mongoose;

const UserSettingSchema = new Schema({
	id: {
        type: String,
        unique: true
    },
	workspace_id: {
		type: String,
		trim: true
	},
	role: {
		type: String
	},	
	timezone: {
		type: String,
		default: ""
	},
	enable_personalised_post_generation: {
		type: Boolean,
        default: false
	},
	topics: {
		type: Array,
		default: []
	},
	language: {
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

const UserSettings = mongoose.model("UserSettings", UserSettingSchema);
module.exports = UserSettings;

