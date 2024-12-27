const { generateUniqueId } = require("../helper");

/*
Carousel schema
*/
const mongoose = require("mongoose");
require("../index");

const {Schema} = mongoose;

const InvoiceSchema = new Schema({
	id: {
        type: String
    },
    account_country: {
		type: String
	},
	account_name: {
		type: String
	},
    amount_due: {
		type: Number
	},
    amount_paid: {
		type: Number
	},
    amount_remaining: {
		type: Number
	},
    amount_shipping: {
		type: Number
	},
    attempt_count: {
		type: Number
	},
    attempted: {
		type: Boolean
	},
    billing_reason: {
		type: String
	},
    charge: {
		type: String
	},
    collection_method: {
		type: String
	},
    currency: {
		type: String
	},
    customer: {
		type: String
	},
    customer_address: {
		type: Object
	},
    customer_email: {
		type: String
	},
    customer_name: {
		type: String
	},
    customer_phone: {
		type: String
	},
    customer_tax_exempt: {
		type: String
	},
    due_date: {
		type: String
	},
    effective_at: {
		type: Number
	},
    hosted_invoice_url: {
		type: String
	},
    invoice_pdf: {
		type: String
	},
    issuer: {
		type: Object
	},
    lines: {
		type: Object
	},
    invoice_number: {
		type: String
	},
    object: {
		type: String
	},
    paid: {
		type: Boolean
	},
    payment_intent: {
		type: String
	},
    payment_settings: {
		type: Object
	},
    period_end: {
		type: Number
	},
    period_start: {
		type: Number
	},
    status: {
		type: String
	},
    status_transitions: {
		type: Object
	},
    subscription: {
		type: String
	},
    subscription_details: {
		type: Object
	},
    subtotal: {
		type: Number
	},
    subtotal_excluding_tax: {
		type: Number
	},
    total: {
		type: Number
	},
    total_excluding_tax: {
		type: Number
	},
    webhooks_delivered_at: {
		type: Number
	},
	created: {
		type: Number
	}
});

const Invoices = mongoose.model("Invoices", InvoiceSchema);
module.exports = Invoices;

