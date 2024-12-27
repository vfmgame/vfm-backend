const { Router  } = require("express");
// import middlewares from '../middlewares';
const { celebrate, Joi } = require("celebrate");
const LinkedinAccountModel = require("../../models/LinkedinAccount");
const WorkspaceModel = require("../../models/Workspace");
const AccountModel = require("../../models/Account");
const SubscriptionModel = require("../../models/Subscription");
const LinkedinService = require("../../services/LinkedinService");
const UserService = require("../../services/UserService");
const CronJobService = require("../../services/CronJobService");
const PaymentService = require("../../services/PaymentService");
const { authentication, authorization } = require("../middleware")
const { sendResponse } = require("../../helper");
const Secrets = require("../../config");
const router = Router();
const authRouter = Router();
const stripe = require('stripe')(Secrets.STRIPE_SECRET_KEY);
const cron = require('node-cron');





authRouter.get("/integrations/check",
  async (req, res, next) => {
    try {
      //const authServiceInstance = new AuthService(UserModel);
      //const { user } = await authServiceInstance.GetLinkedinAuthToken(req.body.code, req.session.user.email);
      return sendResponse(req, res, 200, false, "failure", "Failed");
    } catch (error) {
      console.log(error);
      return next(error);
    }
});

authRouter.post("/integrations/connect",
  async (req, res, next) => {
    try {
      const linkedinServiceInstance = new LinkedinService(LinkedinAccountModel);
      const token = await linkedinServiceInstance.ConnectLinkedin();
      return sendResponse(req, res, 200, false, `https://www.linkedin.com${token}`, "Created Success");
    } catch (error) {
      console.log(error);
      return next(error);
    }
});

authRouter.post("/integrations",
  async (req, res, next) => {
    const { user } = req.body;
    try {
      const linkedinServiceInstance = new LinkedinService(LinkedinAccountModel, AccountModel);
      const account = await linkedinServiceInstance.GetLinkedinAuthToken(req.body.code, req.body.redirect_uri, user.user_id, user.workspace, user.main_id);
      return sendResponse(req, res, 201, false, account, "Created profile Success");
    } catch (error) {
      //console.log(error);
      return next(error);
    }
});


authRouter.delete("/integrations",
  async (req, res, next) => {
    const { user } = req.body;
    try {
      const linkedinServiceInstance = new LinkedinService(LinkedinAccountModel, AccountModel);
      const account = await linkedinServiceInstance.DeleteLinkedinAccount(req.body.linked_in_account_id, user.main_id);
      return sendResponse(req, res, 200, false, account, "Deleted Success");
    } catch (error) {
      console.log(error);
      return next(error);
    }
});

authRouter.get("/integrations",
  async (req, res, next) => {
    const { user } = req.body;
    try {
      const linkedinServiceInstance = new LinkedinService(LinkedinAccountModel, AccountModel);
      const accounts = await linkedinServiceInstance.ListLinkedinAccounts(user.user_id, user.main_id);
      return sendResponse(req, res, 200, false, accounts, "Success");
    } catch (error) {
      console.log(error);
      return next(error);
    }
});


router.use("/", authentication, authorization, authRouter);

module.exports = router;