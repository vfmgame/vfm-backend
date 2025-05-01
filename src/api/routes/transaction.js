const { Router  } = require("express");
const TransactionModel = require("../../models/Transaction");
const TransactionService = require("../../services/TransactionService");
const { sendResponse } = require("../../helper/ResponseHelper");
const { authentication, authorization } = require("../middleware");
const router = Router();
const authRouter = Router();



authRouter.get("/",
  async (req, res, next) => {
    try {
      const transactionServiceInstance = new TransactionService(TransactionModel);
      const transactions = await transactionServiceInstance.GetTransactions(req.user._id);
      return sendResponse(req, res, 200, false, transactions, "Transactions fetched!");
    } catch (error) {
      return next(error)
    }
});

router.use("/", authentication, authorization, authRouter);

module.exports = router;
