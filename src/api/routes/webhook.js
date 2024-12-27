const { Router  } = require("express");
const UserModel = require("../../models/User");
const InvoiceModel = require("../../models/Invoice");
const SubscriptionModel = require("../../models/Subscription");
const { sendResponse } = require("../../helper/ResponseHelper");
const PaymentService = require("../../services/PaymentService");
const Secrets = require("../../config");
const userEvents = require("../../subscribers/user");
const events = require("../../subscribers/events");
const router = Router();
//const stripe = require('stripe')(Secrets.STRIPE_SECRET_KEY);
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");
const stripe = require('stripe')(Secrets.STRIPE_SECRET_KEY, {
    apiVersion: '2020-08-27',
    appInfo: { // For sample support and debugging, not required for production:
      name: "stripe-samples/checkout-single-subscription",
      version: "0.0.1",
      url: "https://github.com/stripe-samples/checkout-single-subscription"
    }
});


router.post("/",
bodyParser.raw({type: "application/json"}),
  async (req, res) => {
    try {
        //  console.log(req.headers);
 
        const ts = new Date(); // timestamp
 
        let data;
        let eventType;

        // Check if webhook signing is configured.
        const webhookSecret = Secrets.STRIPE_WEBHOOK_SECRET;
         
        // Retrieve the event by verifying the signature using the raw body and secret.
        let event;
        const signature = req.headers["stripe-signature"];
    
            try {
                event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
    
            } catch (err) {
                console.log(`⚠️  Webhook signature verification failed.`);
                return sendResponse(req, res, 400, true, false, err);
            }
                // Extract the object from the event.
                data = event.data.object;
                eventType = event.type;

               // console.log(data);
            
    
            switch (eventType) {
                case "customer.subscription.created":
                        // Continue to provision the subscription as payments continue to be made.
                        // Store the status in your database and check when a user accesses your service.
                        // This approach helps you avoid hitting rate limits.
                        console.log(eventType);
                        console.log(data);

                        const product = await stripe.products.retrieve(data.items.data[0].plan.product);
                        console.log(product);
                        // const subscribed = await SubscriptionModel.findOneAndUpdate({ customer_id: data.customer }, {
                        //     $set: {
                        //         status: data.status,
                        //         plan_name: product.name,
                        //         stripe_subscription_id: data.id,
                        //         updated_at: ts
                        //     },
                        //     },
                        // {
                        //     new: true
                        // });

                        //userEvents.dispatch(events.payment.subscribed, { user_id: subscribed.creator_id, plan: product.name });

                    break;
                case "invoice.paid":
                        // Continue to provision the subscription as payments continue to be made.
                        // Store the status in your database and check when a user accesses your service.
                        // This approach helps you avoid hitting rate limits.
                        console.log(eventType);
                        console.log(data);

                        
                        // await SubscriptionModel.findOneAndUpdate({ customer_id: data.customer }, {
                        //     $set: {
                        //         status: data.status,
                        //         event_data: data,
                        //         stripe_subscription_id: data.subscription,
                        //         updated_at: ts
                        //     },
                        //     },
                        // {
                        //     new: true
                        // });

                        const invoice = await InvoiceModel.create({
                            id: data.id,
                            account_country: data.account_country,
                            account_name: data.account_name,
                            amount_due: data.amount_due,
                            amount_paid: data.amount_paid,
                            amount_remaining: data.amount_remaining,
                            amount_shipping: data.amount_shipping,
                            attempt_count: data.attempt_count,
                            attempted: data.attempted,
                            billing_reason: data.billing_reason,
                            charge: data.charge,
                            collection_method: data.collection_method,
                            currency: data.currency,
                            customer: data.customer,
                            customer_address: data.customer_address,
                            customer_email: data.customer_email,
                            customer_name: data.customer_name,
                            customer_phone: data.customer_phone,
                            customer_tax_exempt: data.customer_tax_exempt,
                            due_date: data.due_date,
                            effective_at: data.effective_at,
                            hosted_invoice_url: data.hosted_invoice_url,
                            invoice_pdf: data.invoice_pdf,
                            issuer: data.issuer,
                            lines: data.lines,
                            invoice_number: data.number,
                            object: data.object,
                            paid: data.paid,
                            payment_intent: data.payment_intent,
                            payment_settings: data.payment_settings,
                            period_end: data.period_end,
                            period_start: data.period_start,
                            status: data.status,
                            status_transitions: data.status_transitions,
                            subscription: data.subscription,
                            subscription_details: data.subscription_details,
                            subtotal: data.subtotal,
                            subtotal_excluding_tax: data.subtotal_excluding_tax,
                            total: data.total,
                            total_excluding_tax: data.total_excluding_tax,
                            webhooks_delivered_at: data.webhooks_delivered_at
                        })

                        
                        const plan_name = await stripe.products.retrieve(invoice.lines.data[0].plan.product);
                        console.log(plan_name);
                        //userEvents.dispatch(events.payment.paidInvoice, { email: invoice.customer_email, plan: plan_name.name });

                    break;
                case "customer.created":
                        // Continue to provision the subscription as payments continue to be made.
                        // Store the status in your database and check when a user accesses your service.
                        // This approach helps you avoid hitting rate limits.
                        console.log(eventType);
                        console.log(data);
                        const user = await UserModel.findOne({ email: data.email });

                        // await SubscriptionModel.create({
                        //     id: uuidv4(),
                        //     customer_id: data.id,
                        //     email: data.email,
                        //     creator_id: user.user_id
                        // });
                    break;
                case "customer.subscription.deleted":
                        // Continue to provision the subscription as payments continue to be made.
                        // Store the status in your database and check when a user accesses your service.
                        // This approach helps you avoid hitting rate limits.
                        console.log(eventType);
                        console.log(data);
                        // await SubscriptionModel.findOneAndUpdate({ customer_id: data.customer }, {
                        //     $set: {
                        //         status: data.status,
                        //         plan_id: null,
                        //         plan_name: null,
                        //         current_period_end: null,
                        //         event_data: {},
                        //         stripe_subscription_id: null,
                        //         updated_at: ts
                        //     },
                        //     },
                        // {
                        //     new: true
                        // });
                    break;
                case "customer.subscription.updated":
                        // Continue to provision the subscription as payments continue to be made.
                        // Store the status in your database and check when a user accesses your service.
                        // This approach helps you avoid hitting rate limits.
                        console.log(eventType);
                        console.log(data);
                        const product_name = await stripe.products.retrieve(data.plan.product);
                        console.log(product_name);

                        // const sub = await SubscriptionModel.findOneAndUpdate({ customer_id: data.customer }, {
                        //     $set: {
                        //         status: data.status,
                        //         plan_id: data.plan.id,
                        //         plan_name: product_name.name,
                        //         current_period_end: data.current_period_end,
                        //         stripe_subscription_id: data.id,
                        //         updated_at: ts
                        //     },
                        //     },
                        // {
                        //     new: true
                        // });

                        // await UserModel.findOneAndUpdate({ email: sub.email }, {
                        //     $set: {
                        //         plan_name: product_name.name,
                        //         updated_at: ts
                        //     },
                        //     },
                        // {
                        //     new: true
                        // });
                    break;
                default:
                // Unhandled event type
                console.log("Default");
            }
    
            //console.log(data);
    
            return sendResponse(req, res, 200, false, null, {received: true});
   } catch (error) {
     console.log(error);
   }
});


router.use("/", router);

module.exports = router;
