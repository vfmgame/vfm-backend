const bcrypt = require("bcryptjs");
const { generateUniqueId } = require("../helper");
const axios = require("axios");
const Secrets = require("../config");
const userEvents = require("../subscribers/user");
const events = require("../subscribers/events");
const otpGenerator = require("otp-generator");
const LinkedinService = require("./LinkedinService");



module.exports = class AIService {
    constructor(postModel){
      this.postModel = postModel;
    }

                                                                                                                                                                                   
    async listPostTemplates() {
        const postTemplates = await this.postModel.find();
        return postTemplates;
    }


    async getPostTemplate(id) {
        const postTemplates = await this.postModel.findOne({ id });

        return postTemplates;
    }




}