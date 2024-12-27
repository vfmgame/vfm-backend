const { Router  } = require("express");
// import middlewares from '../middlewares';
const { celebrate, Joi } = require("celebrate");
const CarouselModel = require("../../models/Carousel");
const SubscriptionModel = require("../../models/Subscription");
const AuthService = require("../../services/AuthService");
const CarouselService = require("../../services/CarouselService");
const UserService = require("../../services/UserService");
const CronJobService = require("../../services/CronJobService");
const PaymentService = require("../../services/PaymentService");
const { authentication, authorization } = require("../middleware")
const { sendResponse } = require("../../helper");
const Secrets = require("../../config");
const router = Router();
const authRouter = Router();
const stripe = require('stripe')(Secrets.STRIPE_SECRET_KEY);
const cron = require('node-cron');





authRouter.get("/",
  async (req, res, next) => {
    const { user } = req.body;
    const { page, per_page } = req.query;
    try {
      const CarouselServiceInstance = new CarouselService(CarouselModel);
      const carousels = await CarouselServiceInstance.ListCarousels(user.workspace, Number(page), Number(per_page));
      return sendResponse(req, res, 200, false, carousels, "Carousels fetched successfully");
    } catch (error) {
      return next(error);
    }
});


authRouter.delete("/:id",
  async (req, res, next) => {
    const { id } = req.params;
    try {
      const CarouselServiceInstance = new CarouselService(CarouselModel);
      const carousels = await CarouselServiceInstance.DeleteCarousel(id);
      return sendResponse(req, res, 200, false, carousels, "Carousels deleted successfully");
    } catch (error) {
      return next(error);
    }
});

authRouter.get("/count",
  async (req, res, next) => {
    const { user } = req.body;
    try {
      const CarouselServiceInstance = new CarouselService(CarouselModel);
      const carousels = await CarouselServiceInstance.GetCarouselCount(user.workspace);
      return sendResponse(req, res, 200, false, carousels, "Carousel count fetched successfully");
    } catch (error) {
      return next(error);
    }
});


// authRouter.get("/post_generation_templates",
//   async (req, res, next) => {
//     try {
//       const CarouselServiceInstance = new CarouselService(PostTemplates);
//       const postTemplates = await CarouselServiceInstance.listPostTemplates();
//       return sendResponse(req, res, 200, false, postTemplates, "Post templates fetched successfully");
//     } catch (error) {
//       return next(error);
//     }
// });

// authRouter.get("/post_generation_templates/:id",
//   async (req, res, next) => {
//     const id = req.params.id;
//     try {
//       const CarouselServiceInstance = new CarouselService(PostTemplates);
//       const postTemplates = await CarouselServiceInstance.getPostTemplate(id);
//       return sendResponse(req, res, 200, false, postTemplates, "Post templates fetched successfully");
//     } catch (error) {
//       return next(error);
//     }
// });







router.use("/", authentication, authorization, authRouter);

module.exports = router;