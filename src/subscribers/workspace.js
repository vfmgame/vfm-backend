const { user, workspace } = require("./events");
const UserWorkspaceModel = require("../models/UserWorkspace");
const UserModel = require("../models/User");
const UserSettingModel = require("../models/UserSetting");
const WorkspaceModel = require("../models/Workspace");
const WorkspaceMemberModel = require("../models/WorkspaceMember");
const WorkspaceService = require("../services/WorkspaceService");
const EventEmitter = require("events");
const { v4: uuidv4 } = require('uuid');



class WorkspaceEvents extends EventEmitter {
    dispatch(eventName, message) {
      this.emit(eventName, message);
    }
}

const workspaceEvents = new WorkspaceEvents();


workspaceEvents.on(workspace.createWorkspace, async({ workspace }) => {
    const ts = new Date();
    const space = await WorkspaceModel.findOne({ id: workspace.id });
    await WorkspaceModel.findOneAndUpdate({ id: space.id }, {
        $set: {
            members_count: Number(space.members_count) + 1,
            updated_at: ts
        },
    },
    {
        new: true
    });
});


workspaceEvents.on(workspace.createWorkspace, async({ workspace, timezone, language }) => {
    await UserSettingModel.create({
        id: await uuidv4(),
        language, 
        timezone,
        workspace_id: workspace.id
    });
});

workspaceEvents.on(workspace.createWorkspace, async({ workspace, creator_id }) => {
    const user = await UserModel.findOne({ user_id: creator_id })
    await UserWorkspaceModel.create({
        id: await uuidv4(),
        creator_id: creator_id,
        workspace_id: workspace.id,
        role_id: user.role_id
    });
});


workspaceEvents.on(workspace.createWorkspace, async({ workspace, creator_id }) => {
    const userDetail = await UserModel.findOne({ user_id: creator_id });
    await WorkspaceMemberModel.create({
        id: await uuidv4(),
        email: userDetail.email,
        name: userDetail.name,
        role: userDetail.user_type,
        role_id: user.role_id, 
        user_id: userDetail.user_id,
        workspace_id: workspace.id
    });
});


  
module.exports = workspaceEvents;
