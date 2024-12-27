const bcrypt = require("bcryptjs");
const { generateUniqueId } = require("../helper");
const axios = require("axios");
const Secrets = require("../config");
const userEvents = require("../subscribers/user");
const workspaceEvents = require("../subscribers/workspace");
const events = require("../subscribers/events");
const { uuid } = require("uuidv4");


module.exports = class WorkspaceService {
    constructor(workspaceModel, userWorkspaceModel, workspaceMemberModel) {
      this.workspaceModel = workspaceModel;
      this.userWorkspaceModel = userWorkspaceModel;
      this.workspaceMemberModel = workspaceMemberModel;
    }


    async CreateWorkspace(data, creator_id) {
        const workspace = await this.workspaceModel.create({ id: uuid(), name: data.name.workspace_name })

        if (!workspace) {
            let error = new Error("Workspace cannot be created");
            error.statusCode = 500;
            throw error;
        }
        workspaceEvents.dispatch(events.workspace.createWorkspace, { workspace, creator_id, timezone: data.timezone, language: data.language });
        return workspace;
    }

    async UpdateWorkspace(name, id) {
        
        const ts = new Date(); // timestamp

        const workspace = await this.workspaceModel.findOneAndUpdate({ id }, {
            $set: {
              name,
              updated_at: ts
            },
            },
            {
            new: true
        });

        if (!workspace) {
            let error = new Error("Workspace cannot be updated");
            error.statusCode = 400;
            throw error;
        }

        return workspace;
    }


    async CreateUserWorkspace(data) {
        const createUserWorkspace = await this.userWorkspaceModel.create({ id: uuid(), creator_id: data.creator_id, workspace_id: data.workspace_id, role_id: role_id });

        if (!createUserWorkspace) {
            let error = new Error("UserWorkspace cannot be created");
            error.statusCode = 500;
            throw error;
        }
        //return createUserWorkspace;
    }


    async CreateWorkspaceMember(data) {
        const createWorkspaceMember = await this.workspaceMemberModel.create({ id: uuid(), name: data.name, email: data.email, role: data.role, user_id: data.user_id, role_id: data.role_id });

        if (!createWorkspaceMember) {
            let error = new Error("createWorkspaceMember cannot be created");
            error.statusCode = 500;
            throw error;
        }
        //return createUserWorkspace;
    }


    async CreateEngageList(data) {
        const createList = await this.workspaceModel.create({ id: uuid(), workspace_id: uuid(), title: data.title, icon: data.icon, active: true });

        if (!createList) {
            let error = new Error("List cannot be created");
            error.statusCode = 500;
            throw error;
        }

        const list = createList;
        return list;
    }

    async GetEngageListCount() {
        const count = await this.workspaceModel.findAll();
        //console.log(count);
        return count;
    }

                                                                                                                                                                                   
    async ListWorkspaces(id) {
        const userWorkspaces = await this.userWorkspaceModel.find({ creator_id: id });
        let workspaces = [];
        for (let index = 0; index < userWorkspaces.length; index++) {
            const element = userWorkspaces[index];
            const workspace = await this.workspaceModel.findOne({ id: element.workspace_id });
            if(workspace) {
                workspaces.push(workspace);
                continue
            }
        }
        return {
            workspaces,
            userWorkspaces
        }
    }

    async GetEngageList(id) {
        const list = await this.workspaceModel.findOne({ where: { id }});
        return list;
    }

    async CreateEngageContact(list_id, data) {
        const createContact = await this.userWorkspaceModel.create({ id: uuid(), list_id, profile_urls: data.profile_urls });

        if (!createContact) {
            let error = new Error("Contact cannot be created");
            error.statusCode = 500;
            throw error;
        }

        const contact = createContact;
        return contact;
    }

    async ListEngageContacts(id) {
        const contacts = await this.userWorkspaceModel.findAll({ where: { list_id: id }});
        return contacts;
    }

    async ListUserWorkspaces() {
        const userWorkspaces = await this.userWorkspaceModel.find();
        return userWorkspaces;
    }


    

    // async UpdateCarousel(data, id) {
    //     const carousel = await this.workspaceModel.update({ 
    //         content: data.content,
    //         common_settings: data.common_settings,
    //         slides: data.slides
    //       }, { where: { id },
    //       returning: true
    //     });

    //     console.log(carousel[1]);

    //     return carousel[1];
    // }
}


