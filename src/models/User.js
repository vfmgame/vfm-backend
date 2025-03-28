const { required } = require("joi");
const { generateUniqueId } = require("../helper");

/*
User schema
*/
const mongoose = require("mongoose");
require("../index");


const {Schema} = mongoose;

const UserSchema = new Schema({
	id: {
        type: String,
        unique: true
    },
	userId: {
        type: String,
        unique: true
    },
	firstname: {
		type: String,
		trim: true
	},
	lastname: {
		type: String,
		trim: true
	},
	nickname: {
		type: String,
		unique: 'Two users cannot share the same nickname ({VALUE})',
		trim: true,
		required: true
	},
	avatar: {
		type: String
	},
	color: {
		type: String
	},
	claim: {
		type: Number,
		default: 0
	},
	last_login: {
		type: Date,
		require: false
	},
	login_times: {
		type: Number,
		default: 0
	},
	referred_by: {
		type: String,
		required: false,
		default: null
	},
	referral_earnings: {
		type: Number,
		default: 0,
		required: false
	},
	referral_code: {
		type: String,
		required: false,
		unique: true
	},
	wallet: {
		type: Object,
		default: {
			points: 0,
			passes: 15
		},
		required: false
	},
	isMining: {
		type: Boolean,
		required: false,
		default: false
	},
	miningStartedTime: {
		type: Number,
		default: 0
	},
	mineRate: {
		type: Number,
		default: 0.6945
	},
	claimed_bonus: {
		type: Boolean,
		default: false
	},
	user_verified: {
		type: Boolean,
		default: false
	},
	user_verified_at: {
		type: Date
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

UserSchema.methods.toJSON = function () {
	let userObject = this.toObject();
	delete userObject.__v;
	delete userObject._id;
	return userObject;
};

const Users = mongoose.model("Users", UserSchema);
module.exports = Users;