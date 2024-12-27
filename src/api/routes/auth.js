const { Router  } = require("express");
const { celebrate, Joi } = require("celebrate");
const UserModel = require("../../models/User");
const AccountModel = require("../../models/Account");
const TokenModel = require("../../models/Token");
const WorkspaceModel = require("../../models/Workspace");
const SubscriptionModel = require("../../models/Subscription");
const AuthService = require("../../services/AuthService");
const { authentication, authorization } = require("../middleware")
const { sendResponse } = require("../../helper");
const router = Router();
const authRouter = Router();
const { 
  validate,
  reset_password,
  forgot_password,
  create_account,
  resend_verification_email
} = require("../middleware/validator");




router.post("/signup",
  validate(create_account),
  async (req, res, next) => {
    try {
      const authServiceInstance = new AuthService(UserModel, AccountModel, TokenModel);
      const user = await authServiceInstance.Signup(req.body, req.headers["timezone"], req.headers["accept-language"].split("-")[0]);
      return sendResponse(req, res, 201, false, user, "Account created successfully");
    } catch (error) {
      return next(error);
    }
});


router.post("/validate",
  celebrate({
    body: Joi.object({
      email: Joi.string().email().required()
    }),
  }),
  async (req, res, next) => {
    try {
      const authServiceInstance = new AuthService(UserModel, AccountModel);
      const user = await authServiceInstance.ValidateUserEmail(req.body);
      return sendResponse(req, res, 200, false, user, "Email Validated!");
    } catch (error) {
      console.log(error);
      return next(error);
    }
});


router.post("/login",
  celebrate({
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string()
      .min(8)
      .required()
    }),
  }),
  async (req, res, next) => {
    try {
      const authServiceInstance = new AuthService(UserModel, AccountModel);
      const user = await authServiceInstance.Login(req.body);
      // const cronServiceInstance = new CronJobService(UserModel, SubscriptionModel);
      // cronServiceInstance.checkSubscriptionTask(user);
      return sendResponse(req, res, 200, false, user, "Logged in successfully!");
    } catch (error) {
      console.log(error);
      return next(error);
    }
});



router.get("/logout",
  async (req, res, next) => {
    try {
      req.session.destroy(function (err) {
      if (err) return next(err)
        console.log(err);
        res.clearCookie("setly.sid", {path: "/"});
        return sendResponse(req, res, 200, false, {}, "Logged out successfully!");
      })

      console.log(req.session);
    } catch (error) {
      return next(error);
    }
});


router.post("/email/verify",
  async (req, res, next) => {
    const language = req.headers["accept-language"].split(",")[0].split("-")[0];
    const timezone = req.headers["timezone"];
    try {
      const authServiceInstance = new AuthService(UserModel, AccountModel, TokenModel, SubscriptionModel, WorkspaceModel);
      const verifyEmail = await authServiceInstance.VerifyUserEmail(req.body, timezone, language);
      return sendResponse(req, res, 200, false, verifyEmail, "Email verified successfully!");
    } catch (error) {
      return next(error);
    }
});

router.post("/forgot/password",
  validate(forgot_password),
  async (req, res, next) => {
    try {
      const authServiceInstance = new AuthService(UserModel, AccountModel, TokenModel);
      const response = await authServiceInstance.ForgotPassword(req.body.email);
      return sendResponse(req, res, 200, false, response, "Password reset link sent successfully");
    } catch (error) {
      //return sendResponse(req, res, res.statusCode, true, {}, error.message);
      return next(error);
    }
});


router.put("/reset/password",
  validate(reset_password),
  async (req, res, next) => {
    try {
      const authServiceInstance = new AuthService(UserModel, AccountModel, TokenModel);
      const response = await authServiceInstance.ResetPassword(req.body);
      return sendResponse(req, res, 200, false,  response, "Password reset successfully");
    } catch (error) {
      return next(error);
    }
});


router.post("/email/resend",
  validate(resend_verification_email),
  async (req, res, next) => {
    try {
      const authServiceInstance = new AuthService(UserModel, AccountModel, TokenModel);
      const response = await authServiceInstance.ResendVerifyEmail(req.body.email);
      return sendResponse(req, res, 200, false,  response, "Email resent successfully");
    } catch (error) {
      return next(error);
    }
});


router.get("/connect/linkedin",
  async (req, res, next) => {
    try {
      const authServiceInstance = new AuthService(UserModel);
      const { token } = await authServiceInstance.ConnectLinkedin();
      return sendResponse(req, res, 200, false, `https://www.linkedin.com${token}`, "Please login to Linkedin");
    } catch (error) {
      console.log(error);
      return next(error);
    }
});


router.post("/teams/accept_all_invitations",
celebrate({
  body: Joi.object({
    code: Joi.string().required()
  }),
}),
  async (req, res, next) => {
    try {
      const authServiceInstance = new AuthService(UserModel);
      const { user } = await authServiceInstance.GetLinkedinAuthToken(req.body.code, req.session.user.email);
      return sendResponse(req, res, 200, false, user, "Successful");
    } catch (error) {
      console.log(error);
      return next(error);
    }
});


router.use("/", authentication, authorization, authRouter);

module.exports = router;