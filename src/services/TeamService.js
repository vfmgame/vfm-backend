const bcrypt = require("bcryptjs");
const { generateUniqueId } = require("../helper");
const axios = require("axios");
const Secrets = require("../config");
const teamEvents = require("../subscribers/team");
const events = require("../subscribers/events");
const otpGenerator = require("otp-generator");
const LinkedinService = require("./LinkedinService");
const randtoken = require('rand-token');
const { v4: uuidv4 } = require('uuid');



module.exports = class TeamService {
    constructor(roleModel, workspaceMemberModel, invitationModel, tokenModel, userModel, workspaceModel){
      this.roleModel = roleModel;
      this.workspaceMemberModel = workspaceMemberModel;
      this.invitationModel = invitationModel;
      this.tokenModel = tokenModel;
      this.userModel = userModel;
      this.workspaceModel = workspaceModel;
    }



    async SendTeamInvitation(data, workspace, id) {

        const checkInvitation = await this.invitationModel.findOne({ email: data.email, accepted: true });

        if (checkInvitation) {
            let error = new Error("Account is already a member of a workspace");
            error.statusCode = 400;
            throw error;
        }

        const role = await this.roleModel.findOne({ id: data.role_id });

        const getWorkspace = await this.workspaceModel.findOne({ id: workspace });

        const user = await this.userModel.findOne({ user_id: id });

        const invitation = await this.invitationModel.create({
            id: await uuidv4(),
            email: data.email,
            name: data.name,
            creator_id: user.main_id,
            from_email: user.email,
            from_name: user.name,
            role_id: data.role_id,
            role: role.name,
            workspace_name: getWorkspace.name,
            workspace_id: getWorkspace.id,
        });

        const token = await this.tokenModel.create({
            id: await uuidv4(),
            email: data.email,
            token: randtoken.generate(16),
            type: "invite"
        });

        const link = `${Secrets.STAGING_BASE_URL}/auth/email/update-password/accept-invitation?id=${invitation.id}&token=${token.token}&type=invite&redirect_to=${data.redirect_to}`;

        teamEvents.dispatch(events.invitation.sendInvitation, { email: data.email, inviteeName: data.name, name: user.name, role: role.name, link });
        
        return invitation;
    }


    async GetInvitation(id) {
        const invite = await this.invitationModel.findOne({ id });
        return invite;
    }


    async AcceptInvitation(data) {
        const ts = new Date(); // timestamp

        const checkIfApproved = await this.invitationModel.findOne({ id: data.id });

        if (checkIfApproved.accepted) {
            let error = new Error("Invite already accepted");
            error.statusCode = 200;
            throw error;
        }

        const updateInvitation = await this.invitationModel.findOneAndUpdate({ id: data.id }, {
            $set: {
                accepted: true,
                updated_at: ts
            },
        },
        {
            new: true
        });

        const invite = await this.invitationModel.findOne({ id: data.id })

        teamEvents.dispatch(events.invitation.acceptInvitation, { data, invite });
        
        return updateInvitation;
    }


    async ListRoles() {
        const roles = await this.roleModel.find({ name: { $not: /^ADMIN.*/ } });
        return roles;
    }

    async ListWorkspaceMembers(workspace) {
        const roles = await this.workspaceMemberModel.find({ workspace_id: workspace });
        return roles;
    }

                                                                                                                                                                              
    // async AcceptInvitations(data) {
    //     const checkExistingUser = await this.roleModel.update({ status: 1 }, {
    //         where: {
    //            id: data.id
    //         }
    //       });
    //     const createTeam = await this.roleModel.findOne({ attributes: ["email"], where: { email: data.email }});
    //     console.log(checkExistingUser);
    //     if (checkExistingUser) {
    //         let error = new Error("Account already exists!");
    //         error.statusCode = 401;
    //         throw error;
    //     }

        

    //     const otp = otpGenerator.generate(5, { upperCaseAlphabets: false, lowerCaseAlphabets: false, digits: true, specialChars: false })

    //     const _password = await bcrypt.hash(data.password, 10);

    //     const userRecord = await this.roleModel.create({ email: data.email, password: _password });

    //     if (!userRecord) {
    //         let error = new Error("User cannot be created");
    //         error.statusCode = 500;
    //         throw error;
    //     }

        
    //     //userEvents.dispatch(events.user.signUp, { user: userRecord, otp });

    //     const user = userRecord;
    //     return user;
    // }


    
}
//https://api.supergrow.ai/api/v1/teams/invite_member

//https://ckfwvufqcepsjlnnrzqi.supabase.co/auth/v1/verify?token=5efb4bdca0537dd70727eac8b085b7ca3a54991b1ce78ef38d28f34c&type=invite&redirect_to=https://app.supergrow.ai/auth/email/update-password/accept-invitation

// {
//     "email": "essiensavioru.a@gmail.com",
//     "role_id": "4ea8409f-82ab-4c05-a736-560b23aab296",
//     "redirect_to": "https://app.supergrow.ai/auth/email/update-password/accept-invitation"
// }

// {
//     "from_email": "justin@thecodexmedia.com",
//     "from_name": "Justin Heuff",
//     "role": "CLIENT",
//     "workspace_name": "Codex ",
//     "id": "e9da6bb3-64d3-4d3e-913a-c5d32a019d36"
// }