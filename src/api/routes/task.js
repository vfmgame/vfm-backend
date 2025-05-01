const { Router  } = require("express");
const { celebrate, Joi } = require("celebrate");
const UserModel = require("../../models/User");
const TaskModel = require("../../models/Task");
const TaskService = require("../../services/TaskService");
const { sendResponse } = require("../../helper/ResponseHelper");
const { authentication, authorization } = require("../middleware");
const router = Router();
const authRouter = Router();



authRouter.get("/my",
  async (req, res, next) => {
    try {
      const taskServiceInstance = new TaskService(TaskModel, UserModel);
      const tasks = await taskServiceInstance.GetUserTasks(req.user._id);
      return sendResponse(req, res, 200, false, tasks, "Tasks fetched!");
    } catch (error) {
      return next(error)
    }
});


authRouter.put("/",
  celebrate({
    body: Joi.object({
      id: Joi.string().required(),
      reward: Joi.number().required(),
      passes: Joi.number().required()
    }),
  }),
  async (req, res, next) => {
    try {
      const taskServiceInstance = new TaskService(TaskModel, UserModel);
      const tasks = await taskServiceInstance.CompleteTask(req.body, req.user.userId);
      return sendResponse(req, res, 200, false, tasks, "Task updated!");
    } catch (error) {
      return next(error)
    }
});


authRouter.post("/start",
  celebrate({
    body: Joi.object({
      id: Joi.string().required(),
      subSectionId: Joi.string().required(),
      taskId: Joi.string().required(),
    }),
  }),
  
  async (req, res, next) => {
    try {
      const taskServiceInstance = new TaskService(TaskModel, UserModel);
      const section = await taskServiceInstance.StartSubSectionTask(req.body, req.user._id);
      return sendResponse(req, res, 200, false, section, "Task Started successfully")
    } catch (error) {
      return next(error);
    }
});



router.use("/", authentication, authorization, authRouter);

module.exports = router;
