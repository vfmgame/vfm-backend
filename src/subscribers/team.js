const { invitation, workspace } = require("./events");
const UserWorkspaceModel = require("../models/UserWorkspace");
const UserModel = require("../models/User");
const AccountModel = require("../models/Account");
const InvitationModel = require("../models/Invitation");
const UserSettingModel = require("../models/UserSetting");
const WorkspaceModel = require("../models/Workspace");
const WorkspaceMemberModel = require("../models/WorkspaceMember");
const WorkspaceService = require("../services/WorkspaceService");
const EventEmitter = require("events");
const { v4: uuidv4 } = require('uuid');
const Secrets = require("../config");
const bcrypt = require("bcryptjs");
const randtoken = require('rand-token');
const sendEmailService = require("../services/MailerServices");



class TeamEvents extends EventEmitter {
    dispatch(eventName, message) {
      this.emit(eventName, message);
    }
}

const teamEvents = new TeamEvents();



teamEvents.on(invitation.sendInvitation, async({ email, inviteeName, name, role, link }) => {
    await sendEmailService({
        to: email,
        data: {
            name: inviteeName.split(" ")[0],
            inviter: name,
            role,
            link
        },
        path: "admin_invite",
        subject: "You are Invited to a Workspace"
    })
})

const userId = uuidv4();

teamEvents.on(invitation.acceptInvitation, async({ data, invite }) => {
    const ts = new Date();
    const _password = await bcrypt.hash(data.password, 10);
    await UserModel.create({
        user_id: userId,
        main_id: invite.creator_id,
        name: invite.name,
        avatar: data.avatar,
        email: invite.email,
        password: _password,
        user_type: invite.role,
        email_verified: true,
        email_verified_at: ts,
        role_id: invite.role_id,
        refresh_token: randtoken.generate(16)
    });
});


teamEvents.on(invitation.acceptInvitation, async({ data, invite }) => {
    await UserWorkspaceModel.create({
        id: await uuidv4(),
        creator_id: userId,
        workspace_id: invite.workspace_id,
        role_id: invite.role_id
    });
});


teamEvents.on(invitation.acceptInvitation, async({ data, invite }) => {
    await WorkspaceMemberModel.create({
        id: await uuidv4(),
        user_id: userId,
        name: invite.name,
        email: invite.email,
        role: invite.role,
        workspace_id: invite.workspace_id
    });
});

  
module.exports = teamEvents;
