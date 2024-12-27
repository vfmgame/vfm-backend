const { Router  } = require("express");
// import middlewares from '../middlewares';
const { celebrate, Joi } = require("celebrate");
const WorkspaceModel = require("../../models/Workspace");
const UserWorkspaceModel = require("../../models/UserWorkspace");
const WorkspaceMemberModel = require("../../models/WorkspaceMember");
const SubscriptionModel = require("../../models/Subscription");
const AuthService = require("../../services/AuthService");
const WorkspaceService = require("../../services/WorkspaceService");
const SocketService = require("../../services/SocketService");
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
const { 
  validate,
  create_workspace

} = require("../middleware/validator");
const { workspace } = require("../../subscribers/events");




authRouter.post("/",
  //validate(create_workspace),
  async (req, res, next) => {
    const { user } = req.body;
    try {
      const workspaceServiceInstance = new WorkspaceService(WorkspaceModel);
      const workspace = await workspaceServiceInstance.CreateWorkspace(req.body, user.user_id);
      return sendResponse(req, res, 201, false, workspace, "Workspace created successfully");
    } catch (error) {
      return next(error);
    }
});


authRouter.put("/:id",
  validate(create_workspace),
  async (req, res, next) => {
    const { id } = req.params
    try {
      const workspaceServiceInstance = new WorkspaceService(WorkspaceModel);
      const workspace = await workspaceServiceInstance.UpdateWorkspace(req.body.name, id);
      return sendResponse(req, res, 200, false, workspace, "Workspace updated successfully");
    } catch (error) {
      return next(error);
    }
});


authRouter.get("/",
  async (req, res, next) => {
    const { user } = req.body;
    try {
      const workspaceServiceInstance = new WorkspaceService(WorkspaceModel, UserWorkspaceModel, WorkspaceMemberModel);
      const workspaces = await workspaceServiceInstance.ListWorkspaces(user.user_id);
      return sendResponse(req, res, 200, false, workspaces, "Workspaces listed successfully!");
    } catch (error) {
    console.log(error);
    return next(error);
  }
});



router.post("/teams/accept_all_invitations",
celebrate({
  body: Joi.object({
    code: Joi.string().required()
  }),
}),
  async (req, res, next) => {
    try {
      const authServiceInstance = new AuthService(UserModel);
      const { user } = await authServiceInstance.GetLinkedinAuthToken(req.body.code, req.session.user.email);
      return sendResponse(req, res, 200, false, user, "Successful");
    } catch (error) {
      console.log(error);
      return next(error);
    }
});


router.use("/", authentication, authorization, authRouter);

module.exports = router;