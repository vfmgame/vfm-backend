/*
Calendar schema
*/
const mongoose = require("mongoose");
require("../index");

const {Schema} = mongoose;

const CalendarSchema = new Schema({
    days: {
		type: Array
	},
	month: {
		type: Number
	},
	year: {
		type: Number
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

const Calendars = mongoose.model("Calendars", CalendarSchema);
module.exports = Calendars;

