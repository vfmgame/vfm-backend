const { Router  } = require("express");
const { celebrate, Joi } = require("celebrate");
const UserModel = require("../../models/User");
const AccountModel = require("../../models/Account");
const LinkedinModel = require("../../models/LinkedinAccount");
const UserInfoModel = require("../../models/UserInfo");
const UserSettingModel = require("../../models/UserSetting");
const UserService = require("../../services/UserService");
const SocketService = require("../../services/SocketService");
const SubscriptionModel = require("../../models/Subscription");
const PaymentService = require("../../services/PaymentService");
const LinkedinService = require("../../services/LinkedinService");
const { sendResponse } = require("../../helper/ResponseHelper");
const { authentication, authorization } = require("../middleware");
const Secrets = require("../../config");
const router = Router();
const authRouter = Router();
const { 
  validate,
  create_user_info,
  update_user_info

} = require("../middleware/validator");
const { workspace } = require("../../subscribers/events");



authRouter.get("/me",
  async (req, res, next) => {
    const { user } = req.body;
    try {
      const userServiceInstance = new UserService(UserModel, AccountModel, SubscriptionModel, null, null, LinkedinModel);
      const userDetails = await userServiceInstance.getUser(user.user_id, user.main_id);
      return sendResponse(req, res, 200, false, userDetails, "Account fetched!");
    } catch (error) {
      return next(error)
    }
});

authRouter.put("/password",
  celebrate({
    body: Joi.object({
      old_password: Joi.string().required(),
      password: Joi.string()
      .min(8)
      .required(),
      confirm_password: Joi.ref("password")
    }),
  }),
  async (req, res, next) => {
    const { user } = req.body;
    try {
      const userServiceInstance = new UserService(UserModel, AccountModel);
      const updatePassword = await userServiceInstance.updatePassword(user, req.body);
      return sendResponse(req, res, 200, false, updatePassword, "Password updated successfully");
    } catch (error) {
      return next(error);
    }
});


authRouter.post("/user_infos",
  validate(create_user_info),
  async (req, res, next) => {
    const { user } = req.body;
    try {
      const userServiceInstance = new UserService(UserModel, AccountModel, SubscriptionModel, UserInfoModel);
      const createUserInfo = await userServiceInstance.CreateUserInfo(req.body, user.user_id);
      return sendResponse(req, res, 200, false, createUserInfo, "userInfo Setup Successfully!");
    } catch (error) {
      return next(error);
    }
});


authRouter.put("/user_infos",
  validate(update_user_info),
  async (req, res, next) => {
    try {
      const userServiceInstance = new UserService(UserModel, AccountModel, SubscriptionModel, UserInfoModel);
      const createUserInfo = await userServiceInstance.UpdateUserInfo(req.body);
      return sendResponse(req, res, 200, false, createUserInfo, "userInfo Updated Successfully!");
    } catch (error) {
      return next(error);
    }
});


authRouter.get("/user_infos",
  async (req, res, next) => {
    const { user } = req.body;
    try {
      const userServiceInstance = new UserService(UserModel, AccountModel, SubscriptionModel, UserInfoModel);
      const fetchUserInfo = await userServiceInstance.FetchUserInfo(user.user_id);
      return sendResponse(req, res, 200, false, fetchUserInfo, "userInfo fetched Successfully!");
    } catch (error) {
      return next(error);
    }
});


authRouter.put("/user_settings/:id",
  //validate(update_user_info),
  async (req, res, next) => {
    const { id } = req.params
    try {
      const userServiceInstance = new UserService(UserModel, AccountModel, SubscriptionModel, UserInfoModel, UserSettingModel);
      const createSettingInfo = await userServiceInstance.UpdateUserSettings(req.body, id);
      return sendResponse(req, res, 200, false, createSettingInfo, "userSetting Updated Successfully!");
    } catch (error) {
      return next(error);
    }
});


authRouter.get("/user_settings",
  async (req, res, next) => {
    const { user } = req.body;
    try {
      const userServiceInstance = new UserService(UserModel, AccountModel, SubscriptionModel, UserInfoModel, UserSettingModel);
      const fetchUserInfo = await userServiceInstance.FetchUserSettings(user.workspace);
      return sendResponse(req, res, 200, false, fetchUserInfo, "userSetting fetched Successfully!");
    } catch (error) {
      return next(error);
    }
});


authRouter.put("/notification_channel",
  celebrate({
    body: Joi.object({
      notification_channel: Joi.array().required(),
    }),
  }),
  async (req, res, next) => {
    const { user } = req.session;
    try {
      const userServiceInstance = new UserService(UserModel, AccountModel);
      const updateNotificationChannels = await userServiceInstance.UpdateNotificationChannels(user, req.body.notification_channel);
      return sendResponse(req, res, 200, false, updateNotificationChannels, "Notification Channel updated successfully");
    } catch (error) {
      return next(error);
    }
});


// const socketInstance = new SocketService();
//       const sendNotification = socketInstance.SendNotification("account-verify", null)

authRouter.get("/linkedin",
  async (req, res, next) => {
    const { user } = req.session;
    try {
      const linkedinServiceInstance = new LinkedinService();
      const getLinkedinProfile = await linkedinServiceInstance.GetLinkedinProfile(user.LINKEDIN_ACCESS_TOKEN);
      return sendResponse(req, res, 200, false, getLinkedinProfile, "Linkedin profile successfully");
    } catch (error) {
      return next(error);
    }
});

router.use("/", authentication, authorization, authRouter);

module.exports = router;
