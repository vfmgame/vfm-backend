const bcrypt = require("bcryptjs");
const { generateUniqueId } = require("../helper");
const axios = require("axios");
const Secrets = require("../config");
const engageEvents = require("../subscribers/engageList");
const events = require("../subscribers/events");
const otpGenerator = require("otp-generator");
const LinkedinService = require("./LinkedinService");
const { uuid } = require("uuidv4");



module.exports = class EngageService {
    constructor(engageModel, contactModel, engagePostModel){
      this.engageModel = engageModel;
      this.contactModel = contactModel;
      this.engagePostModel = engagePostModel;
    }


    async CreateEngageList(data, workspace) {
        const createList = await this.engageModel.create({ id: uuid(), workspace_id: workspace, title: data.title, icon: data.icon, active: true });

        if (!createList) {
            let error = new Error("List cannot be created");
            error.statusCode = 500;
            throw error;
        }
        const list = createList;

        return list;
    }

    async GetEngageListCount(workspace) {
        const count = await this.engageModel.find({ workspace_id: workspace});
        return count.length;
    }

                                                                                                                                                                                   
    async ListEngageList(workspace) {
        const lists = await this.engageModel.find({ workspace_id: workspace, active: true });
        return lists;
    }

    async GetEngageList(id) {
        const lists = await this.engageModel.findOne({ id });
        return lists;
    }


    async ListEngageListPosts(id, status, page, per_page) {
        const lists = await this.engagePostModel.aggregate([
            {$match: {id, status}},
            //{$page: page},
            //{$project: {id: page, text: page, rich_text: page, status: page, mentions: page, creator_id: page }},
            {$limit: Number(per_page) || 15}
        ]);
        return {
            list_posts: lists,
            total_count: lists.length
        };
    }

    async CreateEngageContact(list_id, profiles) {
        const contacts = []
        for (let index = 0; index < profiles.length; index++) {
            const profile = profiles[index];
            const contact = {id: uuid(), list_id, profile_url: profile };
            contacts.push(contact);
        }
        const createContacts = await this.contactModel.insertMany(contacts, {upsert: true});
        if (!createContacts) {
            let error = new Error("Contact cannot be created");
            error.statusCode = 500;
            throw error;
        }

        const contact = createContacts;
        engageEvents.dispatch(events.engage.createContact, { list_id });
        return contact;
    }


    async DeleteEngageContact(list_id, id) {
        const contact = await this.contactModel.findOneAndRemove({ list_id, id });

        if (!contact) {
            let error = new Error("Contact cannot be deleted");
            error.statusCode = 500;
            throw error;
        }

        engageEvents.dispatch(events.engage.deleteContact, { list_id });
        return contact;
    }


    async UpdateEngageList(data, id) {
        const ts = new Date(); // timestamp
        const contact = await this.engageModel.findOneAndUpdate({ id }, {
            $set: {
              icon: data.icon,
              title: data.title,
              updated_at: ts
            },
            },
            {
            new: true
        });

        if (!contact) {
            let error = new Error("Contact cannot be updated");
            error.statusCode = 500;
            throw error;
        }

        return contact;
    }


    async ArchiveEngageList(id) {
        const ts = new Date(); // timestamp
        const contact = await this.engageModel.findOneAndUpdate({ id }, {
            $set: {
              active: false,
              updated_at: ts
            },
            },
            {
            new: true
        });

        if (!contact) {
            let error = new Error("Contact cannot be archived");
            error.statusCode = 500;
            throw error;
        }

        return contact;
    }

    async ListEngageContacts(id) {
        const contacts = await this.contactModel.aggregate([
            {$match: {list_id: id }},
            //{$page: page},
            //{$project: {id: page, text: page, rich_text: page, status: page, mentions: page, creator_id: page }},
            //{$limit: Number(per_page)}
        ]);
        return contacts;
    }


    

    // async UpdateCarousel(data, id) {
    //     const carousel = await this.engageModel.update({ 
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