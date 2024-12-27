const { generateUniqueId } = require("../helper");

/*
Carousel schema
*/
const mongoose = require("mongoose");
require("../index");


const {Schema} = mongoose;

const CarouselSchema = new Schema({
	id: {
        type: String,
        unique: true
    },
	workspace_id: {
		type: String,
		trim: true
	},
    template_id: {
		type: String,
		trim: true
	},
	content: {
		type: String
	},
	common_settings: {
		type: Object
	},
	slides: {
		type: Array,
		default: []
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

const Carousels = mongoose.model("Carousels", CarouselSchema);
module.exports = Carousels;

