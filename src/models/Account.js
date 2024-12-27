const { ref } = require("joi");
const { generateUniqueId } = require("../helper");

/*
User schema
*/
const mongoose = require("mongoose");
require("../index");


const {Schema} = mongoose;

const AccountSchema = new Schema({
	creator_id: {
        type: String,
		ref: "User",
        unique: true
    },
	email: {
        type: String,
		ref: "User",
        unique: true
    },
	plan_name: {
		type: String,
		default: "trial"
	},
	words_generated: {
		type: Number,
		default: 0
	},
	words_allowed_in_billing_cycle: {
		type: Number,
		default: 10000
	},
	invites_left: {
		type: Number,
		default: 0
	},
	can_use_gpt4: {
		type: Boolean,
		default: true,
	},
	can_use_ai: {
		type: Boolean,
		default: true,
	},
	number_of_days_left_in_trial: {
		type: Number,
		default: 6
	},
	number_of_linked_in_accounts_allowed: {
		type: Number,
		default: 1
	},
	account_status: {
		type: String,
		enum: ["trial", "active", "blocked", "onboarding", "deactivated"],
		default: "trial",
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

const Accounts = mongoose.model("Accounts", AccountSchema);
module.exports = Accounts;
