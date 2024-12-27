const { user, invitation, payment } = require("./events");
const UserWorkspaceModel = require("../models/UserWorkspace");
const UserModel = require("../models/User");
const AccountModel = require("../models/Account");
const InvoiceModel = require("../models/Invoice");
const UserSettingModel = require("../models/UserSetting");
const WorkspaceModel = require("../models/Workspace");
const PaymentService = require("../services/PaymentService");
const WorkspaceService = require("../services/WorkspaceService");
const paymentService = new PaymentService(UserModel);
const workspaceService = new WorkspaceService(WorkspaceModel);
const agenda = require("../loaders/agenda");
const pulse = require("../jobs/pulse");

const EventEmitter = require("events");
const { v4: uuidv4 } = require('uuid');
const sendEmailService = require("../services/MailerServices");



class UserEvents extends EventEmitter {
    dispatch(eventName, message) {
      this.emit(eventName, message);
    }
}

const userEvents = new UserEvents();







// userEvents.on(user.signUp, async({ user }) => {
//     await paymentService.createPaymentCustomer(user);
// });

// userEvents.on(user.signUp, async() => {
//     await workspaceService.CreateWorkspace({
//         name: "DEFAULT",
//         members_count: 1,
//     });
// });

// userEvents.on(user.signUp, async({language, timezone}) => {
//     setTimeout( async () => {
//         const workspace = await WorkspaceModel.find();
//         console.log(workspace);
//         await UserSettingModel.create({
//             id: await uuidv4(),
//             language, 
//             timezone,
//             workspace_id: workspace[0].id
//         });
//     }, 2000);
// });

// userEvents.on(user.signUp, async({ user }) => {
//     setTimeout( async () => {
//         const workspace = await WorkspaceModel.find();
//         await UserWorkspaceModel.create({
//             id: await uuidv4(),
//             role_id: "290d49ac-e502-4123-87ad-da1b96d627f0", 
//             creator_id: user.user_id,
//             workspace_id: workspace[0].id
//         });
//     }, 4000);
// });


userEvents.on(user.signUp, async({ user, link, otp }) => {
    await sendEmailService({
        to: user.email,
        data: {
            name: user.name.split(" ")[0],
            token: otp
        },
        path: "signup",
        subject: "Confirm your email"
    })
});


userEvents.on(user.resendVerifyEmail, async({ user, otp }) => {
    await sendEmailService({
        to: user.email,
        data: {
            name: user.name.split(" ")[0],
            token: otp
        },
        path: "signup",
        subject: "Confirm your email"
    })
});


userEvents.on(user.verifyEmail, async({ user }) => {
  console.log(user);
  await pulse.every("10 seconds", "check_user_trial", {
    userID: user.main_id
  })
});


userEvents.on(user.forgotPassword, async({ email, name, link }) => {
    await sendEmailService({
        to: email,
        data: {
            name: name.split(" ")[0],
            link
        },
        path: "forgot_password",
        subject: "Reset Password"
    })
})

userEvents.on(user.verifyEmail, async({ user }) => {
    await sendEmailService({
        to: user.email,
        data: {
            name: user.name.split(" ")[0]
        },
        path: "welcome",
        subject: "Welcome to Socialbooster"
    })
})

userEvents.on(payment.paidInvoice, async({ id, email, plan, amount }) => {
    await InvoiceModel.create({
        id: await uuidv4(),
        account_country: "Nigeria",
        account_name: "",
        amount_due: Number(amount),
        amount_paid: Number(amount),
        amount_remaining: 0,
        amount_shipping: 5,
        attempt_count: 1,
        attempted: true,
        billing_reason: "",
        charge: "",
        collection_method: "",
        currency: "USD",
        customer: "",
        customer_address: "data.customer_address",
        customer_email: email,
        customer_name: "",
        customer_phone: "",
        customer_tax_exempt: "",
        due_date: "15",
        effective_at: 6000,
        hosted_invoice_url: "",
        invoice_pdf: "",
        issuer: "",
        lines: "",
        invoice_number: "123456",
        object: {},
        paid: true,
        payment_intent: "",
        payment_settings: {},
        period_end: 50000,
        period_start: 50000,
        status: "paid",
        status_transitions: {},
        subscription: id,
        subscription_details: {},
        subtotal: 19,
        subtotal_excluding_tax: Number(amount),
        total: Number(amount),
        total_excluding_tax: 5,
        webhooks_delivered_at: 42000
    })
})

userEvents.on(payment.paidInvoice, async({ id, email, plan }) => {
    const ts = new Date(); // timestamp
    let words = 0;
    let linkedin_Accounts = 0;
    let invites_left = 0
    switch (plan) {
        case "starter":
            words = 50000;
            invites_left;
            linkedin_Accounts
            break;
        case "pro":
            words = 100000;
            invites_left;
            linkedin_Accounts = 3
            break;
        case "agency":
            words = 200000;
            invites_left = 10
            linkedin_Accounts = 10
            break;
        default:
            break;
    }

    await AccountModel.findOneAndUpdate({ email }, {
        $set: {
            words_allowed_in_billing_cycle: words,
            invites_left,
            number_of_linked_in_accounts_allowed: linkedin_Accounts,
            plan_name: plan,
            can_use_ai: true,
            words_generated: 0,
            account_status: "active",
            updated_at: ts
        },
        },
    {
        new: true
    });
})


// userEvents.on(payment.paidInvoice, async({ email, plan }) => {
//     const ts = new Date(); // timestamp
//     let words = 0;
//     switch (plan) {
//         case "starter":
//             words = 50000;
//             break;
//         case "pro":
//             words = 100000;
//             break;
//         case "agency":
//             words = 200000;
//             break;
//         default:
//             break;
//     }

//     await AccountModel.findOneAndUpdate({ email }, {
//         $set: {
//             words_allowed_in_billing_cycle: words,
//             number_of_linked_in_accounts_allowed: linkedin_Accounts,
//             plan_name: plan,
//             words_generated: 0,
//             account_status: "active",
//             updated_at: ts
//         },
//         },
//     {
//         new: true
//     });
// })



userEvents.on(payment.subscribed, async({ user_id, plan }) => {
    const ts = new Date(); // timestamp
    let linkedin_Accounts = 0;
    let invites_left = 0
    switch (plan) {
        case "starter":
            linkedin_Accounts = 0
            invites_left = 0
            break;
        case "pro":
            linkedin_Accounts = 5;
            invites_left = 5
            break;
        case "agency":
            linkedin_Accounts = 10;
            invites_left = 10
            break;
        default:
            break;
    }

    await AccountModel.findOneAndUpdate({ creator_id: user_id }, {
        $set: {
            number_of_linked_in_accounts_allowed: linkedin_Accounts,
            number_of_days_left_in_trial: 0,
            invites_left,
            updated_at: ts
        },
        },
    {
        new: true
    });
})



userEvents.on(user.postGeneration, async({ creator_id, words }) => {
    const ts = new Date(); // timestamp
    console.log("Sent Event!");
    const getWords = await AccountModel.findOne({ creator_id });
    if(getWords.words_generated >= getWords.words_allowed_in_billing_cycle) {
        return
    }
    await AccountModel.findOneAndUpdate({ creator_id }, {
        $set: {
            words_generated: getWords.words_generated + words.length,
            updated_at: ts
        },
        },
    {
        new: true
    });
})




  
module.exports = userEvents;