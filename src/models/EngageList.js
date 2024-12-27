const { generateUniqueId } = require("../helper");

/*
Carousel schema
*/
const mongoose = require("mongoose");
require("../index");

const {Schema} = mongoose;

const EngageListSchema = new Schema({
	id: {
        type: String,
        unique: true
    },
	workspace_id: {
		type: String,
		trim: true,
        require: true,
		ref: "Workspace"
	},
	automated: {
		type: Boolean,
        default: false
	},
    title: {
		type: String,
        require: true
	},
    icon: {
		type: String,
		require: true
	},
	contacts_count: {
		type: Number,
		default: 0
	},
	hour_of_the_day_in_utc: {
		type: String,
		default: null
	},
	active: {
		type: Boolean,
		default: true
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

const EngageLists = mongoose.model("EngageLists", EngageListSchema);
module.exports = EngageLists;

