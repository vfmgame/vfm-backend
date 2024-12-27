const { generateUniqueId } = require("../helper");

/*
Carousel schema
*/
const mongoose = require("mongoose");
require("../index");

const {Schema} = mongoose;

const BrandkitSchema = new Schema({
	id: {
        type: String,
        unique: true
    },
	workspace_id: {
		type: String,
		trim: true
	},
    name: {
		type: String,
		trim: true
	},
	logo: {
		type: String
	},
    primary_color: {
		type: String,
		trim: true
	},
	secondary_color: {
		type: String
	},
    tertiary_color: {
		type: String
	},
    font: {
		type: String
	},
    handle: {
		type: String
	},
    secondary_font: {
		type: String
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

const Brandkits = mongoose.model("Brandkits", BrandkitSchema);
module.exports = Brandkits;

