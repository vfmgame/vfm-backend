const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require('uuid');

module.exports = class PostTemplateService {
  constructor(postTemplateModel, accountModel, postRewriteTemplateModel, rewriteModel) {
    this.postTemplateModel = postTemplateModel;
    this.accountModel = accountModel;
    this.postRewriteTemplateModel = postRewriteTemplateModel;
    this.rewriteModel = rewriteModel;
  }
    
  async GetPostTemplateByID(id) {
    const post = await this.postTemplateModel.findOne({ id });
    if (!post) {
      let error = new Error("Post Template doesn't exists.");
      error.statusCode = 404;
      throw error;
    }

    return post;
  }


  async ListPostTemplates(creator_id) {
    const account = await this.accountModel.findOne({creator_id});
    if(account.account_status === "expired" && account.number_of_days_left_in_trial < 0 && account.can_use_ai === false) {
      let error = new Error("Trial period has expired!");
      error.statusCode = 402;
      throw error;
    }
    const templates = await this.postTemplateModel.find();
    return templates;
  }

  async CreatePostTemplate(data) {
    const template = await this.postTemplateModel.create({
      external_id: "1000",
      title: data.title, 
      description: data.description,
      image_url: data.image_url,
      post_formats: data.post_formats,
      sort_order: data.sort_order,
      user_input_fields: data.user_input_fields,
      id: await uuidv4()
    });

    if (!template) {
      let error = new Error("Cannot perform task, try again!");
      error.statusCode = 500;
      throw error;
    }
    return template;
  }


  async ListRewriteTemplates() {
    const rewriteTemplates = await this.postRewriteTemplateModel.find();
    return rewriteTemplates;
  }

  async ListRewrite() {
    const rewriteTemplates = await this.rewriteModel.find();
    return rewriteTemplates;
  }


  async CreatePostRewriteTemplate(post_rewrite_templates) {
    const rewriteTemplate = await this.postRewriteTemplateModel.create({
      post_rewrite_templates,
      id: await uuidv4()
    });

    if (!rewriteTemplate) {
      let error = new Error("Cannot perform task, try again!");
      error.statusCode = 500;
      throw error;
    }
    return rewriteTemplate;
  }
}