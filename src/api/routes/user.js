const { Router  } = require("express");
const { celebrate, Joi } = require("celebrate");
const UserModel = require("../../models/User");
const UserService = require("../../services/UserService");
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
const upload = require("../../helper/upload");



router.get("/details/:userId",
  async (req, res, next) => {
    const { userId } = req.params
    try {
      const userServiceInstance = new UserService(UserModel);
      const userDetails = await userServiceInstance.getUser(userId);
      return sendResponse(req, res, 200, false, userDetails, "Account fetched!");
    } catch (error) {
      return next(error)
    }
});


router.get("/refers/:referralId",
  async (req, res, next) => {
    const { referralId } = req.params
    try {
      const userServiceInstance = new UserService(UserModel);
      const userReferral = await userServiceInstance.fetchReferral(referralId);
      return sendResponse(req, res, 200, false, userReferral, "Referral fetched!");
    } catch (error) {
      return next(error)
    }
});

router.put("/bonus/claim",
  celebrate({
    body: Joi.object({
      userId: Joi.string().required(),
      bonus: Joi.number().required()
    }),
  }),
  async (req, res, next) => {
    try {
      const userServiceInstance = new UserService(UserModel);
      const claimBonus = await userServiceInstance.claimBonus(req.body);
      return sendResponse(req, res, 200, false, claimBonus, "Bonus claimed successfully");
    } catch (error) {
      return next(error);
    }
});


router.put("/reward/claim",
  celebrate({
    body: Joi.object({
      userId: Joi.string().required(),
      reward: Joi.number().required()
    }),
  }),
  async (req, res, next) => {
    try {
      const userServiceInstance = new UserService(UserModel);
      const claimBonus = await userServiceInstance.claimReward(req.body);
      return sendResponse(req, res, 200, false, claimBonus, "Reward claimed successfully");
    } catch (error) {
      return next(error);
    }
});


router.post("/farm",
  celebrate({
    body: Joi.object({
      userId: Joi.string().required(),
      isMining: Joi.boolean().required(),
      miningStartedTime: Joi.number().required()
    }),
  }),
  async (req, res, next) => {
    try {
      const userServiceInstance = new UserService(UserModel);
      const startFarming = await userServiceInstance.farmReward(req.body);
      return sendResponse(req, res, 200, false, startFarming, "Farming request successful");
    } catch (error) {
      return next(error);
    }
});


router.post("/upload/avatar", upload("avatars").single("avatar"),
  async (req, res, next) => {
    console.log(req.file.filename);
    try {
      const userServiceInstance = new UserService(UserModel);
      const uploadAvatar = await userServiceInstance.UploadAvatar(req.file.filename, req.body.userId);
      return sendResponse(req, res, 200, false, uploadAvatar, "Upload avatar successful");
    } catch (error) {
      return next(error);
    }
});



router.use("/", authentication, authorization, authRouter);

module.exports = router;
