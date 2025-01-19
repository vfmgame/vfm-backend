const { Router  } = require("express");
const { celebrate, Joi } = require("celebrate");
const UserModel = require("../../models/User");
const AuthService = require("../../services/AuthService");
const { authentication, authorization } = require("../middleware")
const { sendResponse } = require("../../helper");
const router = Router();
const authRouter = Router();
const { 
  validate,
  connect_account,
} = require("../middleware/validator");




router.post("/connect",
  validate(connect_account),
  async (req, res, next) => {
    console.log(req.body);
    try {
      const authServiceInstance = new AuthService(UserModel);
      const user = await authServiceInstance.CreateUser(req.body);
      return sendResponse(req, res, 201, false, user, "Account created successfully");
    } catch (error) {
      return next(error);
    }
});

router.post("/nickname/validate",
  celebrate({
    body: Joi.object({
      nickname: Joi.string().required()
    }),
  }),
  async (req, res, next) => {
    try {
      const authServiceInstance = new AuthService(UserModel);
      const user = await authServiceInstance.CheckExistingUser(req.body);
      return sendResponse(req, res, 200, false, user, "Nickname is available...");
    } catch (error) {
      console.log(error);
      return next(error);
    }
});


router.post("/nickname",
  celebrate({
    body: Joi.object({
      userId: Joi.string().required(),
      nickname: Joi.string().required()
    }),
  }),
  async (req, res, next) => {
    try {
      const authServiceInstance = new AuthService(UserModel);
      const user = await authServiceInstance.SetNickName(req.body);
      return sendResponse(req, res, 200, false, user, "Nickname set successfully!");
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


router.use("/", authentication, authorization, authRouter);

module.exports = router;