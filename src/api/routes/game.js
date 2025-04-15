const { Router  } = require("express");
const { celebrate, Joi } = require("celebrate");
const UserModel = require("../../models/User");
const GameService = require("../../services/GameService");
const { sendResponse } = require("../../helper/ResponseHelper");
const { authentication, authorization } = require("../middleware");
const router = Router();
const authRouter = Router();



authRouter.get("/score",
  async (req, res, next) => {
    try {
      const gameServiceInstance = new GameService(UserModel);
      const gameScore = await gameServiceInstance.GetUserScore(req.user.userId);
      return sendResponse(req, res, 200, false, gameScore, "Game score fetched!");
    } catch (error) {
      return next(error)
    }
});


authRouter.post("/start",
  async (req, res, next) => {
    try {
      const gameServiceInstance = new GameService(UserModel);
      const gameScore = await gameServiceInstance.StartGame(req.user.userId);
      return sendResponse(req, res, 200, false, gameScore, "Game started!");
    } catch (error) {
      return next(error)
    }
});


authRouter.put("/score",
  celebrate({
    body: Joi.object({
      points: Joi.number().required()
    }),
  }),
  async (req, res, next) => {
    try {
      const gameServiceInstance = new GameService(UserModel);
      const gameScore = await gameServiceInstance.AddUserScore(req.body.points, req.user.userId);
      return sendResponse(req, res, 200, false, gameScore, "Game score updated!");
    } catch (error) {
      return next(error)
    }
});


router.use("/", authentication, authorization, authRouter);

module.exports = router;
