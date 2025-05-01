/*
AdminTask schema
*/
const mongoose = require("mongoose");
require("../index");


const { Schema } = mongoose;


const SubSectionTaskSchema = new Schema({
    icon: {
        type: String,
        required: true,
        default: ""
    },
    type: { 
        type: String,
        enum: ["APPLICATION_LAUNCH", "SOCIAL_SUBSCRIPTION", "INTERNAL", "WALLET_CONNECTION", "PROGRESS_TARGET"],
        required: true
    },
    validationType: {
        type: String,
        enum: ["DEFAULT", "KEYWORD"],
        required: true
    },
    subType: {
        type: String,
        enum: ["MINI_APP", "SHARE_STORIES", "INSTAGRAM", "FACEBOOK", "TELEGRAM", "TWITTER", "YOUTUBE", "REFERRAL",
            "TON_CONNECT", "XION_CONNECT", "FARMING"
        ],
        required: true
    },
    isShared: {
        type: Boolean,
        required: false
    },
    sharingDescription: {
        type: String,
        default: ""
    },
    title: {
        type: String,
        required: true,
    },
    productName: {
        type: String,
        default: null
    },
    description: {
        type: String,
        default: null
    },
    reward: {
        type: Object,
        required: true
    },
    socialSubscription: {
        type: Object,
        default: {}
    },
    applicationLaunch: {
        type: Object,
        default: {}
    },
    isHidden: {
        type: Boolean,
        default: false
    },
    isDisclaimerRequired: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ["NOT_STARTED", "STARTED", "FINISHED", "READY_FOR_CLAIM", "READY_FOR_VERIFY"],
        default: "NOT_STARTED"
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

// SubTask Schema inside SubSections
const SubSectionSchema = new mongoose.Schema({
    title: String,
    tasks: [SubSectionTaskSchema],
});

const AdminTaskSchema = new Schema({
    creatorId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Admin"
    },
    tasks: {
        type: Array,
        default: []
    },
    subSections: [SubSectionSchema],
    sectionType: {
        type: String,
        enum: ["WEEKLY_ROUTINE", "REGULAR", "DEFAULT"],
        required: true
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


AdminTaskSchema.methods.toJSON = function () {
    let taskObject = this.toObject();
    delete taskObject.__v;
    return taskObject;
};

SubSectionTaskSchema.methods.toJSON = function () {
    let taskObject = this.toObject();
    delete taskObject.__v;
    subType === "MINI_APP" && delete taskObject.socialSubscription;
    type === "SOCIAL_SUBSCRIPTION" && delete taskObject.applicationLaunch;
    return taskObject;
};

const AdminTasks = mongoose.model("AdminTasks", AdminTaskSchema);
module.exports = AdminTasks;