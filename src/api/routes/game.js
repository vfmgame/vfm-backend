const { Router  } = require("express");
const { celebrate, Joi } = require("celebrate");
const UserModel = require("../../models/User");
const GameModel = require("../../models/Game");
const GameService = require("../../services/GameService");
const { sendResponse } = require("../../helper/ResponseHelper");
const { authentication, authorization } = require("../middleware");
const router = Router();
const authRouter = Router();



authRouter.get("/score",
  async (req, res, next) => {
    try {
      const gameServiceInstance = new GameService(GameModel, UserModel);
      const gameScore = await gameServiceInstance.GetUserScore(req.user.user_id);
      return sendResponse(req, res, 200, false, gameScore, "Game score fetched!");
    } catch (error) {
      return next(error)
    }
});


authRouter.put("/score",
  async (req, res, next) => {
    try {
      const gameServiceInstance = new GameService(GameModel, UserModel);
      const gameScore = await gameServiceInstance.AddUserScore(req.user.user_id);
      return sendResponse(req, res, 200, false, gameScore, "Game score updated!");
    } catch (error) {
      return next(error)
    }
});


router.use("/", authentication, authorization, authRouter);

module.exports = router;
