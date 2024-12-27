const { Router  } = require("express");
// import middlewares from '../middlewares';
const InvoiceModel = require("../../models/Invoice");
const InvoiceService = require("../../services/InvoiceService");
const { authentication, authorization } = require("../middleware")
const { sendResponse } = require("../../helper");
const router = Router();
const authRouter = Router();

authRouter.get("/",
  async (req, res, next) => {
    const { user } = req.body;
    try {
      const invoiceServiceInstance = new InvoiceService(InvoiceModel);
      const invoices = await invoiceServiceInstance.ListInvoices(user.user_email);
      return sendResponse(req, res, 200, false, invoices, "Listed invoices successfully");
    } catch (error) {
      return next(error);
    }
});


router.use("/", authentication, authorization, authRouter);

module.exports = router;