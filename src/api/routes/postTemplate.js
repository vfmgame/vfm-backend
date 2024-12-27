const { Router  } = require("express");
// import middlewares from '../middlewares';
const AccountModel = require("../../models/Account");
const PostTemplateModel = require("../../models/PostTemplate");
const PostRewriteTemplateModel = require("../../models/PostRewriteTemplate");
const RewriteTemplateModel = require("../../models/RewriteTemplate");
const CronJobService = require("../../services/CronJobService");
const PostTemplateService = require("../../services/PostTemplateService");
const { authentication, authorization } = require("../middleware")
const { sendResponse } = require("../../helper");
const Secrets = require("../../config");
const router = Router();
const authRouter = Router();
const { 
  validate,
  create_post_template,
  create_rewrite_template

} = require("../middleware/validator");



authRouter.get("/",
  async (req, res, next) => {
    try {
      const PostServiceInstance = new PostTemplateService(PostTemplateModel, AccountModel, PostRewriteTemplateModel);
      const templates = await PostServiceInstance.ListPostTemplates();
      return sendResponse(req, res, 200, false, templates, "Post Templates fetched!");
    } catch (error) {
      return next(error)
    }
});




authRouter.get("/rewrites_templates",
  async (req, res, next) => {
    try {
      const PostServiceInstance = new PostTemplateService(PostTemplateModel, AccountModel, PostRewriteTemplateModel);
      const rewriteTemplates = await PostServiceInstance.ListRewriteTemplates();
      return sendResponse(req, res, 200, false, rewriteTemplates, "Rewrite Templates fetched!");
    } catch (error) {
      return next(error)
    }
});







router.post("/rewrite",
  validate(create_rewrite_template),
  async (req, res, next) => {
    try {
      const PostServiceInstance = new PostTemplateService(PostTemplateModel, AccountModel, PostRewriteTemplateModel);
      const rewriteTemplate = await PostServiceInstance.CreatePostRewriteTemplate(req.body.post_rewrite_templates);
      return sendResponse(req, res, 201, false, rewriteTemplate, "Rewrite template created successfully");
    } catch (error) {
      return next(error);
    }
});




// authRouter.get("/rewrites/templates",
//   async (req, res, next) => {
//     try {
//       const PostServiceInstance = new PostTemplateService(PostTemplateModel, PostRewriteTemplateModel, RewriteTemplateModel);
//       const rewriteTemplates = await PostServiceInstance.ListRewrite();
//       return sendResponse(req, res, 200, false, rewriteTemplates, "Rewrite Templates fetched!");
//     } catch (error) {
//       return next(error)
//     }
// });


authRouter.get("/:id",
  async (req, res, next) => {
    const { id } = req.params;
    try {
      const PostServiceInstance = new PostTemplateService(PostTemplateModel, AccountModel, PostRewriteTemplateModel);
      const template = await PostServiceInstance.GetPostTemplateByID(id);
      return sendResponse(req, res, 200, false, template, "Templates fetched!");
    } catch (error) {
      return next(error)
    }
});



router.post("/",
  validate(create_post_template),
  async (req, res, next) => {
    try {
      const PostServiceInstance = new PostTemplateService(PostTemplateModel, AccountModel, PostRewriteTemplateModel);
      const template = await PostServiceInstance.CreatePostTemplate(req.body);
      return sendResponse(req, res, 201, false, template, "Post template created successfully");
    } catch (error) {
      return next(error);
    }
});




router.use("/", authentication, authorization, authRouter);

module.exports = router;