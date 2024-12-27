const { generateUniqueId } = require("../helper");

/*
User schema
*/
const mongoose = require("mongoose");
require("../index");


const {Schema} = mongoose;

const UserInfoSchema = new Schema({
	id: {
        type: String,
        unique: true
    },
	creator_id: {
		type: String,
		trim: true,
	},
	onboarding_completed: {
		type: String
	},
	linked_in_profile_url: {
		type: String,
		default: null
	},
	problems_to_solve: {
		type: Array
	},
	source_of_discovery: {
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

const UserInfos = mongoose.model("UserInfos", UserInfoSchema);
module.exports = UserInfos;
