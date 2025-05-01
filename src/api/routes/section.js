const { Router  } = require("express");
const { celebrate, Joi } = require("celebrate");
const SectionModel = require("../../models/Section");
const UserModel = require("../../models/User");
const TaskModel = require("../../models/Task");
const SectionService = require("../../services/SectionService");
const { authentication, authorization } = require("../middleware")
const { sendResponse } = require("../../helper");
const router = Router();
const authRouter = Router();




authRouter.get("/",
  async (req, res, next) => {
    try {
      const sectionServiceInstance = new SectionService(SectionModel);
      const tasks = await sectionServiceInstance.ListTasks(req.user._id);
      return sendResponse(req, res, 200, false, tasks, "Tasks fetched!");
    } catch (error) {
      return next(error)
    }
});

router.post("/section",
  celebrate({
    body: Joi.object({
      sectionType: Joi.string().required()
    }),
  }),
  async (req, res, next) => {
    try {
      const sectionServiceInstance = new SectionService(SectionModel, UserModel);
      const section = await sectionServiceInstance.CreateSection(req.body.sectionType, "thanks");
      return sendResponse(req, res, 201, false, section, "Section created successfully")
    } catch (error) {
      console.log(error);
      return next(error);
    }
});


router.put("/section/task",
  celebrate({
    body: Joi.object({
      sectionId: Joi.string().required(),
      type: Joi.string().required(),
      title: Joi.string().required(),
      validationType: Joi.string().required(),
      subType: Joi.string().required(),
      reward: Joi.object().required(),
      socialSubscription: Joi.object().optional()
    }),
  }),
  async (req, res, next) => {
    try {
      const sectionServiceInstance = new SectionService(SectionModel, TaskModel);
      const section = await sectionServiceInstance.CreateSectionTask(req.body);
      return sendResponse(req, res, 200, false, section, "Section Task created successfully")
    } catch (error) {
      console.log(error);
      return next(error);
    }
});


router.put("/subsection",
  celebrate({
    body: Joi.object({
      sectionType: Joi.string().required(),
      title: Joi.string().required()
    }),
  }),
  async (req, res, next) => {
    try {
      const sectionServiceInstance = new SectionService(SectionModel, UserModel);
      const section = await sectionServiceInstance.CreateSubSection(req.body);
      return sendResponse(req, res, 200, false, section, "SubSection created successfully")
    } catch (error) {
      console.log(error);
      return next(error);
    }
});


router.put("/subsection/task",
  celebrate({
    body: Joi.object({
      sectionType: Joi.string().required(),
      subSectionTitle: Joi.string().required(),
      status: Joi.string().required(),
      type: Joi.string().required(),
      title: Joi.string().required(),
      icon: Joi.string().required(),
      validationType: Joi.string().required(),
      subType: Joi.string().required(),
      reward: Joi.object().required(),
      socialSubscription: Joi.object().optional()
    }),
  }),
  async (req, res, next) => {
    try {
      const sectionServiceInstance = new SectionService(SectionModel, UserModel);
      const section = await sectionServiceInstance.AddSubSectionTask(req.body);
      return sendResponse(req, res, 200, false, section, "Task created successfully")
    } catch (error) {
      console.log(error);
      return next(error);
    }
});


authRouter.post("/subsection/task/start",
  celebrate({
    body: Joi.object({
      title: Joi.string().required(),
      taskId: Joi.string().required(),
    }),
  }),
  async (req, res, next) => {
    try {
      const sectionServiceInstance = new SectionService(SectionModel, UserModel);
      const section = await sectionServiceInstance.StartSubSectionTask(req.body, req.user._id);
      return sendResponse(req, res, 200, false, section, "Task Started successfully")
    } catch (error) {
      return next(error);
    }
});




router.use("/", authentication, authorization, authRouter);

module.exports = router;