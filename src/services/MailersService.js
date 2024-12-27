const formData = require("form-data");
const Mailgun = require("mailgun.js");
const mailgun = new Mailgun(formData);
const Secrets = require("../config");
const mg = mailgun.client({username: "api", key: Secrets.MAILER_API_KEY});


module.exports = class MailerService { 

  async SendVerifyEmail(user, template, link, otp) {
    /**
     * @TODO Call Mailchimp/Sendgrid or whatever
     */
    // Added example for sending mail from mailgun
    const data = {
      from: "Setly <seth@setly.ai>",
      to: [user.email],
      subject: "Verify Setly Account",
      template,
	    'h:X-Mailgun-Variables': JSON.stringify({ // be sure to stringify your payload
        name: user.name.split(" ")[0],
        otp
      }),
    };
    try {
      const sendMail = await mg.messages.create(Secrets.MAILER_DOMAIN, data);
      console.log(sendMail);
      return { delivered: 1, status: "ok" };
    } catch(e) {
      return  { delivered: 0, status: e.message };
    }
  }


  async SendResetPasswordEmail(email, template, otp) {
    /**
     * @TODO Call Mailchimp/Sendgrid or whatever
     */
    // Added example for sending mail from mailgun
    const data = {
      from: "Setly <seth@setly.ai>",
      to: [email],
      subject: "Reset Password",
      template,
	    'h:X-Mailgun-Variables': JSON.stringify({ // be sure to stringify your payload
        otp
      }),
    };
    try {
      const sendMail = await mg.messages.create(Secrets.MAILER_DOMAIN, data);
      console.log(sendMail);
      return { delivered: 1, status: "ok" };
    } catch(e) {
      return  { delivered: 0, status: e.message };
    }
  }


  async SendWelcomeEmail(user, template) {
    /**
     * @TODO Call Mailchimp/Sendgrid or whatever
     */
    // Added example for sending mail from mailgun
    const data = {
      from: "Setly <seth@setly.ai>",
      to: [user.email],
      subject: "Welcome to Setly",
      template,
	    'h:X-Mailgun-Variables': JSON.stringify({ // be sure to stringify your payload
        name: user.first_name
      }),
    };
    try {
      const sendMail = await mg.messages.create(Secrets.MAILER_DOMAIN, data);
      console.log(sendMail);
      return { delivered: 1, status: "ok" };
    } catch(e) {
      return  { delivered: 0, status: e.message };
    }
  }


  async SendTeamInvitationEmail(email, template, otp) {
    /**
     * @TODO Call Mailchimp/Sendgrid or whatever
     */
    // Added example for sending mail from mailgun
    const data = {
      from: "Setly <seth@setly.ai>",
      to: [email],
      subject: "You have been invited",
      template,
	    'h:X-Mailgun-Variables': JSON.stringify({ // be sure to stringify your payload
        name: email.split("@")[0],
        otp
      }),
    };
    try {
      const sendMail = await mg.messages.create(Secrets.MAILER_DOMAIN, data);
      console.log(sendMail);
      return { delivered: 1, status: "ok" };
    } catch(e) {
      return  { delivered: 0, status: e.message };
    }
  }




  StartEmailSequence(sequence, user) {
    if (!user.email) {
      throw new Error("No email provided");
    }
    // @TODO Add example of an email sequence implementation
    // Something like
    // 1 - Send first email of the sequence
    // 2 - Save the step of the sequence in database
    // 3 - Schedule job for second email in 1-3 days or whatever
    // Every sequence can have its own behavior so maybe
    // the pattern Chain of Responsibility can help here.
    return { delivered: 1, status: "ok" };
  }
}