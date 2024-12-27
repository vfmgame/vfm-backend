const { generateUniqueId } = require("../helper");

/*
Carousel schema
*/
const mongoose = require("mongoose");
require("../index");

const {Schema} = mongoose;

const TimeSlotSchema = new Schema({
	id: {
        type: String
    },
    workspace_id: {
		type: String,
		ref: "Workspace",
        required: true
	},
	creator_id: {
		type: String,
		ref: "User"
	},
    hour: {
		type: Number,
        required: true
	},
	minute: {
		type: Number,
        required: true
	},
	day_of_week: {
		type: Number,
        required: true
	},
    day: {
		type: String
	},
	selected: {
		type: Boolean,
		required: true
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

const TimeSlots = mongoose.model("TimeSlots", TimeSlotSchema);
module.exports = TimeSlots;

