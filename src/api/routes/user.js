const { Router  } = require("express");
const { celebrate, Joi } = require("celebrate");
const UserModel = require("../../models/User");
const UserService = require("../../services/UserService");
const { sendResponse } = require("../../helper/ResponseHelper");
const { authentication, authorization } = require("../middleware");
const Secrets = require("../../config");
const router = Router();
const authRouter = Router();
const upload = require("../../helper/upload");



authRouter.get("/details",
  async (req, res, next) => {
    try {
      const userServiceInstance = new UserService(UserModel);
      const userDetails = await userServiceInstance.getUser(req.user.user_id);
      return sendResponse(req, res, 200, false, userDetails, "Account fetched!");
    } catch (error) {
      return next(error)
    }
});


authRouter.get("/refers",
  async (req, res, next) => {
    const { referralId } = req.query;
    try {
      const userServiceInstance = new UserService(UserModel);
      const userReferral = await userServiceInstance.FetchReferral(referralId);
      return sendResponse(req, res, 200, false, userReferral, "Referral fetched!");
    } catch (error) {
      return next(error)
    }
});


authRouter.put("/profile",
  celebrate({
    body: Joi.object({
      nickname: Joi.string().required()
    }),
  }),
  async (req, res, next) => {
    try {
      const userServiceInstance = new UserService(UserModel);
      const user = await userServiceInstance.UpdateUserProfile(req.body.nickname, req.user.user_id);
      return sendResponse(req, res, 200, false, user, "Profile updated successfully!");
    } catch (error) {
      console.log(error);
      return next(error);
    }
});

authRouter.put("/bonus/claim",
  celebrate({
    body: Joi.object({
      bonus: Joi.number().required()
    }),
  }),
  async (req, res, next) => {
    try {
      const userServiceInstance = new UserService(UserModel);
      const claimBonus = await userServiceInstance.ClaimBonus(req.body.bonus, req.user.user_id);
      return sendResponse(req, res, 200, false, claimBonus, "Bonus claimed successfully");
    } catch (error) {
      return next(error);
    }
});


authRouter.put("/reward/claim",
  celebrate({
    body: Joi.object({
      reward: Joi.number().required()
    }),
  }),
  async (req, res, next) => {
    try {
      const userServiceInstance = new UserService(UserModel);
      const claimBonus = await userServiceInstance.ClaimReward(req.body.reward, req.user.user_id);
      return sendResponse(req, res, 200, false, claimBonus, "Reward claimed successfully");
    } catch (error) {
      return next(error);
    }
});


authRouter.post("/farm",
  celebrate({
    body: Joi.object({
      isMining: Joi.boolean().required(),
      miningStartedTime: Joi.number().required()
    }),
  }),
  async (req, res, next) => {
    try {
      const userServiceInstance = new UserService(UserModel);
      const startFarming = await userServiceInstance.FarmReward(req.body, req.user.user_id);
      return sendResponse(req, res, 200, false, startFarming, "Farming request successful");
    } catch (error) {
      return next(error);
    }
});


authRouter.post("/upload/avatar", upload("avatars").single("avatar"),
  async (req, res, next) => {
    try {
      const userServiceInstance = new UserService(UserModel);
      const uploadAvatar = await userServiceInstance.UploadAvatar(req.file.filename, req.user.user_id);
      return sendResponse(req, res, 200, false, uploadAvatar, "Avatar upload successful");
    } catch (error) {
      return next(error);
    }
});



router.use("/", authentication, authorization, authRouter);

module.exports = router;
