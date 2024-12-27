const { Router  } = require("express");
// import middlewares from '../middlewares';
const { celebrate, Joi } = require("celebrate");
const UserModel = require("../../models/User");
const AccountModel = require("../../models/Account");
const InvoiceModel = require("../../models/Invoice");
const SubscriptionModel = require("../../models/Subscription");
const LinkedinAccountModel = require("../../models/LinkedinAccount");
const SocketService = require("../../services/SocketService");
const PaymentService = require("../../services/PaymentService");
const { authentication, authorization } = require("../middleware")
const { sendResponse } = require("../../helper");
const Secrets = require("../../config");
const router = Router();
const authRouter = Router();
const { 
  validate,
  create_post,
  update_post,
  publish_post

} = require("../middleware/validator");



authRouter.post("/checkout",
  async (req, res, next) => {
    const { user } = req.body;
    try {
      const paymentServiceInstance = new PaymentService(UserModel, AccountModel, SubscriptionModel, InvoiceModel);
      const session = await paymentServiceInstance.CheckoutSession(user, req.body);
      return sendResponse(req, res, 200, false, session, "Checkout sesssion created successfully");
    } catch (error) {
      return next(error);
    }
});


authRouter.delete("/cancel_subscription",
  async (req, res, next) => {
    const { user } = req.body
    try {
      const paymentServiceInstance = new PaymentService(UserModel, AccountModel, SubscriptionModel, InvoiceModel);
      const post = await paymentServiceInstance.CancelSubscription(user);
      return sendResponse(req, res, 200, false, post, "Subscription cancelled successfully");
    } catch (error) {
      return next(error);
    }
});

router.use("/", authentication, authorization, authRouter);

module.exports = router;