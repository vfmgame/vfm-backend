/*
Section schema
*/
const mongoose = require("mongoose");
require("../index");


const {Schema} = mongoose;

const SectionSchema = new Schema({
    id: {
        type: String,
        unique: true
    },
    creatorId: {
        type: String,
        required: true
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User"
    },
    tasks: {
        type: Array,
        default: []
    },
    subSections: {
        type: Array,
        default: []
    },
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
SectionSchema.methods.toJSON = function () {
    let sectionObject = this.toObject();
    delete sectionObject.__v;
    delete sectionObject._id;
    delete sectionObject.id;
    delete sectionObject.creatorId;
    delete sectionObject.userId;
    return sectionObject;
};

const Sections = mongoose.model("Sections", SectionSchema);
module.exports = Sections;