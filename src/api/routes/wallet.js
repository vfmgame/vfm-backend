const { Router  } = require("express");
const { celebrate, Joi } = require("celebrate");
const WalletModel = require("../../models/Wallet");
const WalletService = require("../../services/WalletService");
const { sendResponse } = require("../../helper/ResponseHelper");
const { authentication, authorization } = require("../middleware");
const router = Router();
const authRouter = Router();



authRouter.get("/my/points/balance",
  async (req, res, next) => {
    try {
      const walletServiceInstance = new WalletService(WalletModel);
      const balance = await walletServiceInstance.FetchBalance(req.user._id);
      return sendResponse(req, res, 200, false, balance, "Balance fetched!");
    } catch (error) {
      return next(error)
    }
});

router.use("/", authentication, authorization, authRouter);

module.exports = router;
