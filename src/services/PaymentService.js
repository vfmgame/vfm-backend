const bcrypt = require("bcryptjs");
const { generateUniqueId } = require("../helper");
const axios = require("axios");
const Secrets = require("../config");
const { v4: uuidv4 } = require('uuid');
const userEvents = require("../subscribers/user");
const events = require("../subscribers/events");
//const stripe = require("stripe")(Secrets.STRIPE_SECRET_KEY);
const stripe = require('stripe')(Secrets.STRIPE_SECRET_KEY, {
    apiVersion: '2020-08-27',
    appInfo: { // For sample support and debugging, not required for production:
      name: "stripe-samples/checkout-single-subscription",
      version: "0.0.1",
      url: "https://github.com/stripe-samples/checkout-single-subscription"
    }
});

module.exports = class PaymentService {
    constructor(userModel, accountModel, subscriptionModel, invoiceModel){
        this.userModel = userModel;
        this.accountModel = accountModel;
        this.subscriptionModel = subscriptionModel;
        this.invoiceModel = invoiceModel;
    }
    

    async createPaymentCustomer(data) {
        const ts = new Date(); // timestamp
        const customer = await stripe.customers.create({
          name: data.first_name + " " + data.last_name,
          email: data.email,
        });

        if (!customer) {
            let error = new Error("Cannot create customer");
            error.statusCode = 500;
            throw error;
        }

        const updateUser = await this.accountModel.findOneAndUpdate({ email: data.email }, {
            $set: {
              customer_id: customer.id,
              updated_at: ts
            },
            },
            {
            new: true
        });

        if (!updateUser) {
            let error = new Error("Cannot update user.");
            error.statusCode = 500;
            throw error;
        }
        
        return customer;
    }

    async CheckoutSession(user, data) {
        console.log(data);
        // const session = await stripe.checkout.sessions.create({
        //     mode: "subscription",
        //     payment_method_types: ["card"],
        //     customer_email: user.user_email,
        //     line_items: [
        //         {
        //             price: data.price,
        //             quantity: data.quantity
        //         },
        //     ],
        //     automatic_tax: {enabled: true},
        //     success_url: data.success_url,
        //     cancel_url: data.cancel_url
        // });
        // return session.url;

        const amount = data.amount.split("$")[0];

        const subscription = await this.subscriptionModel.create({
            id: await uuidv4(),
            email: user.user_email,
            creator_id: user.main_id,
            customer_id: await uuidv4(),
            plan_id: data.price,
            plan_name: data.plan_name,
            quantity: data.quantity,
            current_period_end: 30,
            event_data: {},
            stripe_subscription_id: await uuidv4(),
            status: "paid"
        });

        const ts = new Date(); // timestamp
        let words = 0;
        let linkedin_Accounts = 0;
        let invites_left = 0
        switch (data.plan_name) {
            case "starter":
                words = 50000
                invites_left = 0
                linkedin_Accounts = 1
                break;
            case "pro":
                words = 100000
                invites_left = 0
                linkedin_Accounts = 3
                break;
            case "agency":
                words = 200000
                invites_left = 10
                linkedin_Accounts = 10
                break;
            default:
                break;
        }

        await this.accountModel.findOneAndUpdate({ creator_id: user.main_id }, {
            $set: {
                words_allowed_in_billing_cycle: words,
                invites_left: invites_left,
                number_of_linked_in_accounts_allowed: linkedin_Accounts,
                plan_name: data.plan_name,
                can_use_ai: true,
                words_generated: 0,
                account_status: "active",
                updated_at: ts
            },
            },
        {
            new: true
        });

        await this.invoiceModel.create({
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
            customer_email: user.user_email,
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
            paid: true,
            payment_intent: "",
            period_end: 50000,
            period_start: 50000,
            status: "paid",
            subscription: subscription.id,
            subtotal: 19,
            subtotal_excluding_tax: Number(amount),
            total: Number(amount),
            total_excluding_tax: 5,
            webhooks_delivered_at: 42000
        })

        //userEvents.dispatch(events.payment.paidInvoice, { id: subscription.id, email: user.user_email, plan: data.plan_name, amount: data.amount.split("$")[0]});

        return subscription;
    }



    async CreateSubscription(user) {
        const ts = new Date(); // timestamp
        const subscription = await stripe.subscriptions.create({
            customer: user.customer_id,
            items: [{
              price: Secrets.STRIPE_PRICE_ID,
            }],
            payment_behavior: "default_incomplete",
            payment_settings: { save_default_payment_method: "on_subscription"},
            expand: ["latest_invoice.payment_intent", "pending_setup_intent"],
            trial_end:  new Date(+new Date + 12096e5),
        });

        if (!subscription) {
            let error = new Error("Cannot complete this request");
            error.statusCode = 500;
            throw error;
        }

        // await this.subscriptionModel.create({ 
        //     user_id: user.id,
        //     customer_id: subscription.customer,
        //     subscription: subscription.id,
        //     subscription_status: subscription.status,
        //     updated_at: ts
        // });

        //console.log(subscription);

        if (subscription.pending_setup_intent !== null) {
            return {
                type: "setup",
                clientSecret: subscription.pending_setup_intent.client_secret,
                subscription
            }
          } else {
            return {
                type: "payment",
                clientSecret: subscription.latest_invoice.payment_intent.client_secret,
            }
        }
    }

    async CollectUserPaymentDetails(customer) {
        const setupIntent = await stripe.setupIntents.create({
            customer,
            automatic_payment_methods: {
                enabled: true,
            },
        });

        if (!setupIntent) {
            let error = new Error("Cannot complete this request");
            error.statusCode = 500;
            throw error;
        }

        return setupIntent;
    }


    async ConfirmPaymentDetails(clientSecret) {
        let message;
        let status;
        const confirmIntent = await stripe.setupIntents.retrieve(clientSecret);

        switch (confirmIntent.status) {
              case "succeeded":
                status = "succeeded";
                message = "You've successfully set up your payment method for future payments.";
                console.log("Success");
                break;
              case "processing":
                status = "processing";
                message = "Hold tight, we're setting up your payment method for future payments. We'll email you when your payment method has been successfully setup.";
                console.log("Processing");
                break;
              case "requires_action":
                status = "requires_action";
                message = "Authenticate your payment method";
                console.log("Require Payment");
                break;
              case "requires_confirmation":
                status = "requires_confirmation";
                message = "Confirm payment setup";
                console.log("Require Payment");
                break;
              case "requires_payment_method":
                status = "requires_payment_method";
                message = "Setup a new payment method";
                console.log("Require Payment");
                break;
              default:
                status = "error";
                message = "We are sorry, there was an error setting up your payment method. Please try again with a different payment method.";
                console.log("Error");
                break;
        }

        if (!confirmIntent) {
            let error = new Error("Cannot complete this request");
            error.statusCode = 500;
            throw error;
        }

        return {
            status,
            message,
            data: confirmIntent
        };
    }




    async ChargeUserPaymentDetails(customer, paymentMethod) {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 2400,
            currency: "usd",
            // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
            automatic_payment_methods: {enabled: true},
            customer,
            payment_method: paymentMethod,
            return_url: "https://app.setly.ai/payment/complete",
            off_session: true,
            confirm: true,
        });

        if (!paymentIntent) {
            let error = new Error("Cannot complete this request");
            error.statusCode = 500;
            throw error;
        }

        return paymentIntent;
    }


    async CreateCustomerPortal(customer) {
        const session = await stripe.billingPortal.sessions.create({
            customer,
            return_url: 'https://dashboard.setly.ai/settings',
        });

        if (!session) {
            let error = new Error("Cannot complete this request");
            error.statusCode = 500;
            throw error;
        }

        return session;
    }


    async CreateInvoice(data) {

        const invoice = await stripe.invoices.create({
            customer: data.customer_id,
            subscription: data.subscription
        });

        if (!invoice) {
            let error = new Error("Cannot complete this request");
            error.statusCode = 500;
            throw error;
        }

        return invoice;
    }


    async CancelSubscription(user) {
        await this.subscriptionModel.findOneAndDelete({ creator_id: user.main_id }); 
        await this.invoiceModel.findOneAndDelete({ customer_email: user.user_email });
    }

    async Webhook() {
    
    }
}