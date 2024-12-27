const Secrets = require("../config");
const axios = require("axios").default;
const linkedinEvents = require("../subscribers/linkedin");
const events = require("../subscribers/events");


module.exports = class LinkedinService { 
  constructor(invoiceModel) {
    this.invoiceModel = invoiceModel;
  }


  async ListInvoices(email) {
    const invoices = await this.invoiceModel.find({ customer_email: email });
    return invoices;
  }

}