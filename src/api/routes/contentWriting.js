const { Router  } = require("express");
// import middlewares from '../middlewares';
const { celebrate, Joi } = require("celebrate");
const ContentWritingModel = require("../../models/ContentWriting");
const UserWorkspaceModel = require("../../models/UserWorkspace");
const AuthService = require("../../services/AuthService");
const WorkspaceService = require("../../services/WorkspaceService");
const SocketService = require("../../services/SocketService");
const ContentWritingService = require("../../services/ContentWritingService");
const { authentication, authorization } = require("../middleware")
const { sendResponse } = require("../../helper");
const Secrets = require("../../config");
const router = Router();
const authRouter = Router();
const { 
  validate,
  create_content_writing

} = require("../middleware/validator");




authRouter.post("/",
  validate(create_content_writing),
  async (req, res, next) => {
    const { user } = req.body
    try {
      const contentServiceInstance = new ContentWritingService(ContentWritingModel);
      const content = await contentServiceInstance.CreateContentWriting(req.body, user.workspace);
      return sendResponse(req, res, 201, false, content, "Content created successfully");
    } catch (error) {
      return next(error);
    }
});




authRouter.get("/",
  async (req, res, next) => {
    try {
      const contentServiceInstance = new ContentWritingService(ContentWritingModel);
      const contents = await contentServiceInstance.ListContentWriting();
      return sendResponse(req, res, 200, false, contents, "Content writing successfully!");
    } catch (error) {
    console.log(error);
    return next(error);
  }
});


authRouter.get("/:id",
  async (req, res, next) => {
    const { id } = req.params;
    try {
      const contentServiceInstance = new ContentWritingService(ContentWritingModel);
      const content = await contentServiceInstance.GetContentWriting(id);
      return sendResponse(req, res, 200, false, content, "Content writing successfully!");
    } catch (error) {
    console.log(error);
    return next(error);
  }
});


authRouter.delete("/:id",
  async (req, res, next) => {
    const { id } = req.params;
    try {
      const contentServiceInstance = new ContentWritingService(ContentWritingModel);
      const content = await contentServiceInstance.DeleteContentWriting(id);
      return sendResponse(req, res, 200, false, content, "Content deleted successfully");
    } catch (error) {
      return next(error);
    }
});

authRouter.put("/:id",
  validate(create_content_writing),
  async (req, res, next) => {
    const { user } = req.body;
    const { id } = req.params;
    try {
      const contentServiceInstance = new ContentWritingService(ContentWritingModel);
      const content = await contentServiceInstance.UpdateContentWriting(req.body, id, user.workspace);
      return sendResponse(req, res, 200, false, content, "Content writing updated successfully");
    } catch (error) {
      return next(error);
    }
});



router.use("/", authentication, authorization, authRouter);

module.exports = router;