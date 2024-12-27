const formData = require("form-data");
const Mailgun = require("mailgun.js");
const Secrets = require("../config");
const mailgun = new Mailgun(formData);
const mailer = mailgun.client({username: "api", key: Secrets.MAILER_API_KEY});


module.exports = mailer;