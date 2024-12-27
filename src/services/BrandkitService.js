const bcrypt = require("bcryptjs");
const { generateUniqueId } = require("../helper");
const axios = require("axios");
const Secrets = require("../config");
const userEvents = require("../subscribers/user");
const events = require("../subscribers/events");
const otpGenerator = require("otp-generator");
const LinkedinService = require("./LinkedinService");
const { uuid } = require("uuidv4");



module.exports = class BrandkitService {
    constructor(brandkitModel, userbrandkitModel){
      this.brandkitModel = brandkitModel;
      this.userbrandkitModel = userbrandkitModel;
    }


    async CreateBrandkit(data, workspace) {
        const createBrandkit = await this.brandkitModel.create({ 
            id: uuid(), 
            workspace_id: workspace,
            name: data.name,
            handle: data.handle,
            logo: data.logo,
            font: data.font,
            primary_color: data.primary_color,
            secondary_color: data.secondary_color,
            tertiary_color: data.tertiary_color,
            secondary_font: data.secondary_font,
        });

        if (!createBrandkit) {
            let error = new Error("Brandkit cannot be created");
            error.statusCode = 500;
            throw error;
        }

        const brandkit = createBrandkit;
        return brandkit;
    }


                                                                                                                                                                                   
    async ListBrandkits() {
        const brandkits = await this.brandkitModel.find();

        return brandkits;
    }


    async DeleteBrandkit(id) {
        const brandkit = await this.brandkitModel.findOneAndDelete({ id });
        if (!brandkit) {
          let error = new Error("Cannot perform task, try again!");
          error.statusCode = 500;
          throw error;
        }
        return brandkit;
    }

    async GetEngageList(id) {
        const list = await this.brandkitModel.findOne({ where: { id }});
        return list;
    }
    

    async UpdateBrandkit(data, id) {
        const ts = new Date(); // timestamp

        const brandkit = await this.brandkitModel.findOneAndUpdate({ id }, {
            $set: {
                name: data.name,
                handle: data.handle,
                logo: data.logo,
                font: data.font,
                primary_color: data.primary_color,
                secondary_color: data.secondary_color,
                tertiary_color: data.tertiary_color,
                secondary_font: data.secondary_font,
                updated_at: ts
            },
            },
            {
            new: true
        });

        console.log(brandkit);

        return brandkit;
    }
}