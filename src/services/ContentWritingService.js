const bcrypt = require("bcryptjs");
const { generateUniqueId } = require("../helper");
const axios = require("axios");
const Secrets = require("../config");
const userEvents = require("../subscribers/user");
const workspaceEvents = require("../subscribers/workspace");
const events = require("../subscribers/events");
const { uuid } = require("uuidv4");



module.exports = class ContentWritingService {
    constructor(contentWritingModal) {
      this.contentWritingModal = contentWritingModal;
    }


    async CreateContentWriting(data, workspace) {
        const id = uuid();
        const ts = new Date(); // timestamp

        const content = await this.contentWritingModal.create({ id, name: data.name, 
            posts: [
                {
                    id: uuid(),
                    content_writing_style_id: id,
                    workspace_id: workspace,
                    post_id: null,
                    text: data.posts[0].text,
                    created_at: ts,
                    updated_at: ts
                },
                {
                    id: uuid(),
                    content_writing_style_id: id,
                    workspace_id: workspace,
                    post_id: null,
                    text: data.posts[1].text,
                    created_at: ts,
                    updated_at: ts
                },
                {
                    id: uuid(),
                    content_writing_style_id: id,
                    workspace_id: workspace,
                    post_id: null,
                    text: data.posts[2].text,
                    created_at: ts,
                    updated_at: ts
                },
                {
                    id: uuid(),
                    content_writing_style_id: id,
                    workspace_id: workspace,
                    post_id: null,
                    text: data.posts[3].text,
                    created_at: ts,
                    updated_at: ts
                },
                {
                    id: uuid(),
                    content_writing_style_id: id,
                    workspace_id: workspace,
                    post_id: null,
                    text: data.posts[4].text,
                    created_at: ts,
                    updated_at: ts
                },
                {
                    id: uuid(),
                    content_writing_style_id: id,
                    workspace_id: workspace,
                    post_id: null,
                    text: data.posts[5].text,
                    created_at: ts,
                    updated_at: ts
                },
                {
                    id: uuid(),
                    content_writing_style_id: id,
                    workspace_id: workspace,
                    post_id: null,
                    text: data.posts[6].text,
                    created_at: ts,
                    updated_at: ts
                },
                {
                    id: uuid(),
                    content_writing_style_id: id,
                    workspace_id: workspace,
                    post_id: null,
                    text: data.posts[7].text,
                    created_at: ts,
                    updated_at: ts
                },
                {
                    id: uuid(),
                    content_writing_style_id: id,
                    workspace_id: workspace,
                    post_id: null,
                    text: data.posts[8].text,
                    created_at: ts,
                    updated_at: ts
                },
                {
                    id: uuid(),
                    content_writing_style_id: id,
                    workspace_id: workspace,
                    post_id: null,
                    text: data.posts[9].text,
                    created_at: ts,
                    updated_at: ts
                },
            ], 
            workspace_id: workspace, status: "analyzing" });

        if (!content) {
            let error = new Error("Content cannot be created");
            error.statusCode = 500;
            throw error;
        }
        return content;
    }
                                                                                                                                                                                   
    async ListContentWriting() {
        const contents = await this.contentWritingModal.find();
        return contents
    }

    async GetContentWriting(id) {
        const content = await this.contentWritingModal.findOne({ id });
        return content;
    }

    async DeleteContentWriting(id) {
        const content = await this.contentWritingModal.findOneAndDelete({ id });
        if (!content) {
          let error = new Error("Cannot perform task, try again!");
          error.statusCode = 500;
          throw error;
        }
        return content;
    }


    async UpdateContentWriting(data, id, workspace) {
        const ts = new Date(); // timestamp
    
        const content = await this.contentWritingModal.findOneAndUpdate({ id }, {
          $set: {
            name: data.name,
            posts: [
                {
                    id: uuid(),
                    content_writing_style_id: id,
                    workspace_id: workspace,
                    post_id: null,
                    text: data.posts[0].text,
                    created_at: ts,
                    updated_at: ts
                },
                {
                    id: uuid(),
                    content_writing_style_id: id,
                    workspace_id: workspace,
                    post_id: null,
                    text: data.posts[1].text,
                    created_at: ts,
                    updated_at: ts
                },
                {
                    id: uuid(),
                    content_writing_style_id: id,
                    workspace_id: workspace,
                    post_id: null,
                    text: data.posts[2].text,
                    created_at: ts,
                    updated_at: ts
                },
                {
                    id: uuid(),
                    content_writing_style_id: id,
                    workspace_id: workspace,
                    post_id: null,
                    text: data.posts[3].text,
                    created_at: ts,
                    updated_at: ts
                },
                {
                    id: uuid(),
                    content_writing_style_id: id,
                    workspace_id: workspace,
                    post_id: null,
                    text: data.posts[4].text,
                    created_at: ts,
                    updated_at: ts
                },
                {
                    id: uuid(),
                    content_writing_style_id: id,
                    workspace_id: workspace,
                    post_id: null,
                    text: data.posts[5].text,
                    created_at: ts,
                    updated_at: ts
                },
                {
                    id: uuid(),
                    content_writing_style_id: id,
                    workspace_id: workspace,
                    post_id: null,
                    text: data.posts[6].text,
                    created_at: ts,
                    updated_at: ts
                },
                {
                    id: uuid(),
                    content_writing_style_id: id,
                    workspace_id: workspace,
                    post_id: null,
                    text: data.posts[7].text,
                    created_at: ts,
                    updated_at: ts
                },
                {
                    id: uuid(),
                    content_writing_style_id: id,
                    workspace_id: workspace,
                    post_id: null,
                    text: data.posts[8].text,
                    created_at: ts,
                    updated_at: ts
                },
                {
                    id: uuid(),
                    content_writing_style_id: id,
                    workspace_id: workspace,
                    post_id: null,
                    text: data.posts[9].text,
                    created_at: ts,
                    updated_at: ts
                },
            ], 
            updated_at: ts
          },
          },
          {
          new: true
        });
    
        if (!content) {
          let error = new Error("Cannot update content writing, try again!");
          error.statusCode = 500;
          throw error;
        }
        return content;
    }
}