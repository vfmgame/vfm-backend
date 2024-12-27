const { generateUniqueId } = require("../helper");

/*
User schema
*/
const mongoose = require("mongoose");
require("../index");


const {Schema} = mongoose;

const SubscriptionSchema = new Schema({
	id: {
		type: String,
		ref: "Users"
	},
	email: {
		type: String
	},
	creator_id: {
		type: String,
        ref: "Users"
	},
	customer_id: {
		type: String
	},
	plan_id: {
		type: String,
		default: null
	},
	plan_name: {
		type: String,
		default: null
	},
	quantity: {
		type: Number
	},
	current_period_end: {
		type: String
	},
	event_data: {
		type: Object
	},
	stripe_subscription_id: {
		type: String
	},
	status: {
		type: String,
		enum: ["paid", "active", "canceled", "default_incomplete", "incomplete", "unpaid", "past_due", "trialing", "incomplete_expired"],
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

const Subscriptions = mongoose.model("Subscriptions", SubscriptionSchema);

module.exports = Subscriptions;
