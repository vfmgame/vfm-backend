const { required } = require("joi");
const { generateUniqueId } = require("../helper");

/*
User schema
*/
const mongoose = require("mongoose");
require("../index");


const {Schema} = mongoose;

const UserSchema = new Schema({
	userId: {
        type: String,
        unique: true
    },
	firstName: {
		type: String,
		trim: true
	},
	lastName: {
		type: String,
		trim: true
	},
	nickName: {
		type: String,
		unique: "Two users cannot share the same nickname ({VALUE})",
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
	lastCheckedIn: {
		type: Date,
		default: Date.now()
	},
	checkedIn: {
		type: Boolean,
		default: false
	},
	checkedInDays: {
		type: Number,
		default: 0
	},
	referredBy: {
		type: String,
		required: false,
		default: null
	},
	referralEarnings: {
		type: Number,
		default: 0,
		required: false
	},
	referralCode: {
		type: String,
		required: false,
		unique: true
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
		default: 0.0021
	},
	claimedBonus: {
		type: Boolean,
		default: false
	},
	userVerified: {
		type: Boolean,
		default: false
	},
	userVerifiedAt: {
		type: Date
	},
	createdAt: {
		type: Date,
		default: Date.now()
	},
	updatedAt: {
		type: Date,
		default: Date.now()
	}
});

UserSchema.methods.toJSON = function () {
	let userObject = this.toObject();
	delete userObject.__v;
	return userObject;
};

// Middleware: before saving new user
UserSchema.post("save", async function (doc, next) {
	console.log(doc);

	try {
		const AdminTaskModel = require("./AdminTask");
		const TaskModel = require("./Task");
		const tasks = await AdminTaskModel.find({}).lean();

		tasks.map(task => (
			TaskModel.create({
			userId: doc._id,
			tasks: task.tasks,
			sectionType: task.sectionType,
			subSections: task.subSections,
			})
		));
		console.log("✅ Tasks copied to new user.");
	} catch (error) {
		console.error("❌ Error copying Tasks to new user:", error);
		return next(error);
	}
	next();
});

const Users = mongoose.model("Users", UserSchema);
module.exports = Users;