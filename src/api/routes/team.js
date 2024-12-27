const { Router  } = require("express");
// import middlewares from '../middlewares';
const { celebrate, Joi } = require("celebrate");
const RoleModel = require("../../models/Role");
const WorkspaceMemberModel = require("../../models/WorkspaceMember");
const WorkspaceModel = require("../../models/Workspace");
const InvitationModel = require("../../models/Invitation");
const TokenModel = require("../../models/Token");
const UserModel = require("../../models/User");
const SubscriptionModel = require("../../models/Subscription");
const AuthService = require("../../services/AuthService");
const TeamService = require("../../services/TeamService");
const CronJobService = require("../../services/CronJobService");
const PaymentService = require("../../services/PaymentService");
const { authentication, authorization } = require("../middleware")
const { sendResponse } = require("../../helper");
const Secrets = require("../../config");
const router = Router();
const authRouter = Router();
const { 
  validate,
  send_team_invitation,
  accept_invitation
} = require("../middleware/validator");

const restrictRole = require("../middleware/restrictRole");


authRouter.post("/invite_member",
  restrictRole(Secrets.USER_ADMIN),
  validate(send_team_invitation),
  async (req, res, next) => {
    const { user } = req.body;
    try {
      const teamServiceInstance = new TeamService(RoleModel, WorkspaceMemberModel, InvitationModel, TokenModel, UserModel, WorkspaceModel);
      const invite = await teamServiceInstance.SendTeamInvitation(req.body, user.workspace, user.user_id);
      return sendResponse(req, res, 201, false, invite, "Invite Successful");
    } catch (error) {
      console.log(error);
      return next(error);
    }
});

// authRouter.get("/user_invitation",
//   async (req, res, next) => {
//     const { user } = req.body;
//     try {
//       const teamServiceInstance = new TeamService(RoleModel, WorkspaceMemberModel, InvitationModel);
//       const invite = await teamServiceInstance.GetInvitation(user.user_email);
//       return sendResponse(req, res, 200, false, invite, "Fetch Invite Successful");
//     } catch (error) {
//       console.log(error);
//       return next(error);
//     }
// });

router.get("/user_invitation/:id",
  async (req, res, next) => {
    const id = req.params.id;
    try {
      const teamServiceInstance = new TeamService(RoleModel, WorkspaceMemberModel, InvitationModel);
      const invite = await teamServiceInstance.GetInvitation(id);
      return sendResponse(req, res, 200, false, invite, "Fetch Invite Successful");
    } catch (error) {
      console.log(error);
      return next(error);
    }
});


router.post("/accept_invitation",
  validate(accept_invitation),
  async (req, res, next) => {
    try {
      const teamServiceInstance = new TeamService(RoleModel, WorkspaceMemberModel, InvitationModel);
      const invite = await teamServiceInstance.AcceptInvitation(req.body);
      return sendResponse(req, res, 200, false, invite, "Invite Accepted Successful");
    } catch (error) {
      console.log(error);
      return next(error);
    }
});

router.post("/accept_all_invitations",
  async (req, res, next) => {
    try {
      //const authServiceInstance = new AuthService(UserModel);
      //const { user } = await authServiceInstance.GetLinkedinAuthToken(req.body.code, req.session.user.email);
      return sendResponse(req, res, 200, false, "", "Successful");
    } catch (error) {
      console.log(error);
      return next(error);
    }
});


authRouter.get("/roles",
  async (req, res, next) => {
    try {
      const teamServiceInstance = new TeamService(RoleModel, WorkspaceMemberModel);
      const roles = await teamServiceInstance.ListRoles();
      return sendResponse(req, res, 200, false, roles, "Successful");
    } catch (error) {
      console.log(error);
      return next(error);
    }
});


authRouter.get("/workspace_members",
  restrictRole(Secrets.USER_ADMIN),
  async (req, res, next) => {
    const { user } = req.body;
    try {
      const teamServiceInstance = new TeamService(RoleModel, WorkspaceMemberModel);
      const workspace_members = await teamServiceInstance.ListWorkspaceMembers(user.workspace);
      return sendResponse(req, res, 200, false, workspace_members, "Successful");
    } catch (error) {
      console.log(error);
      return next(error);
    }
});


router.use("/", authentication, authorization, authRouter);

module.exports = router;