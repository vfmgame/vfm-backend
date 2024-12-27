const { Router  } = require("express");
// import middlewares from '../middlewares';
const { celebrate, Joi } = require("celebrate");
const PostModel = require("../../models/Post");
const AccountModel = require("../../models/Account");
const TimeSlotInstanceModel = require("../../models/TimeSlotInstance");
const LinkedinAccountModel = require("../../models/LinkedinAccount");
const SocketService = require("../../services/SocketService");
const PostService = require("../../services/PostService");
const CronJobService = require("../../services/CronJobService");
const PaymentService = require("../../services/PaymentService");
const { authentication, authorization } = require("../middleware")
const { sendResponse } = require("../../helper");
const Secrets = require("../../config");
const router = Router();
const authRouter = Router();
const { 
  validate,
  create_post,
  update_post,
  publish_post

} = require("../middleware/validator");



authRouter.post("/",
  async (req, res, next) => {
    const { user } = req.body;
    try {
      const postServiceInstance = new PostService(PostModel, AccountModel, LinkedinAccountModel);
      const post = await postServiceInstance.CreateDraftPost(req.body, user.main_id, user.workspace);
      return sendResponse(req, res, 201, false, post, "Post created successfully");
    } catch (error) {
      return next(error);
    }
});


authRouter.post("/:id/publish",
  async (req, res, next) => {
    const id = req.params.id;
    try {
      const postServiceInstance = new PostService(PostModel, AccountModel, LinkedinAccountModel);
      const post = await postServiceInstance.PublishPost(id);
      return sendResponse(req, res, 201, false, post, "Post publised successfully");
    } catch (error) {
      return next(error);
    }
});


authRouter.delete("/:id",
  async (req, res, next) => {
    const { id } = req.params;
    try {
      const postServiceInstance = new PostService(PostModel, AccountModel);
      const post = await postServiceInstance.DeleteDraftPost(id);
      return sendResponse(req, res, 200, false, post, "Post deleted created successfully");
    } catch (error) {
      return next(error);
    }
});


authRouter.get("/",
  async (req, res, next) => {
    const { user } = req.body;
    const { status, page, per_page } = req.query;
    try {
      const postServiceInstance = new PostService(PostModel, AccountModel);
      const posts = await postServiceInstance.ListPosts(user.main_id, status, Number(page), Number(per_page));
      return sendResponse(req, res, 200, false, posts, "Posts fetched!");
    } catch (error) {
      return next(error)
    }
});


authRouter.get("/count",
  async (req, res, next) => {
    const { user } = req.body;
    try {
      const postServiceInstance = new PostService(PostModel, AccountModel);
      const count = await postServiceInstance.GetPostCount(user.main_id, user.workspace);
      return sendResponse(req, res, 200, false, count, "Posts count fetched!");
    } catch (error) {
      return next(error)
    }
});



authRouter.get("/:id",
  async (req, res, next) => {
    const { id } = req.params;
    try {
      const postServiceInstance = new PostService(PostModel, AccountModel, null, TimeSlotInstanceModel);
      const post = await postServiceInstance.GetPostByID(id);
      return sendResponse(req, res, 200, false, post, "Post fetched!");
    } catch (error) {
      return next(error)
    }
});



authRouter.put("/:id",
  async (req, res, next) => {
    const { id } = req.params;
    try {
      const postServiceInstance = new PostService(PostModel, AccountModel);
      const post = await postServiceInstance.UpdateDraftPost(req.body, id);
      return sendResponse(req, res, 200, false, post, "Post updated successfully");
    } catch (error) {
      console.log(error)
      return next(error);
    }
});

router.use("/", authentication, authorization, authRouter);

module.exports = router;