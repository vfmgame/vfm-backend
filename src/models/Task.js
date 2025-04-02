/*
Task schema
*/
const mongoose = require("mongoose");
require("../index");


const {Schema} = mongoose;

const TaskSchema = new Schema({
    id: {
        type: String,
        unique: true
    },
    userId: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["social", "refer"],
        required: true
    },
    reward: {
        type: Number,
        required: true
    },
    icon: {
        type: String,
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    status: {
        type: Boolean,
        default: false
    },
    task: {
        type: String,
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
TaskSchema.methods.toJSON = function () {
    let taskObject = this.toObject();
    delete taskObject.__v;
    delete taskObject._id;
    return taskObject;
};

const Tasks = mongoose.model("Tasks", TaskSchema);
module.exports = Tasks;