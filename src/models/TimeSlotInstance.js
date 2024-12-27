const { generateUniqueId } = require("../helper");

/*
Carousel schema
*/
const mongoose = require("mongoose");
require("../index");

const {Schema} = mongoose;

const TimeSlotInstanceSchema = new Schema({
	id: {
        type: String,
        unique: true
    },
    workspace_id: {
		type: String,
		ref: "Workspace",
        required: true
	},
	post_id: {
		type: String,
		ref: "Post",
        required: true
	},
	post: {
		type: Object
	},
    time_slot_id: {
		type: String,
		ref: "TimeSlot"
	},
    day_of_the_month: {
		type: Number,
        required: true
	},
    month: {
		type: Number,
        required: true
	},
	year: {
		type: Number,
        required: true
	},
    day_of_week: {
		type: Number
	},
    hour: {
		type: Number,
	},
    minute: {
		type: Number,
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

const TimeSlotInstances = mongoose.model("TimeSlotInstances", TimeSlotInstanceSchema);
module.exports = TimeSlotInstances;

