const { handleAPIErrors } = require("../helper");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios").default;
const postEvents = require("../subscribers/post");
const events = require("../subscribers/events");

module.exports = class PostService {
  constructor(postModel, accountModel, linkedinModel, timeSlotInstanceModel) {
    this.postModel = postModel;
    this.accountModel = accountModel;
    this.linkedinModel = linkedinModel;
    this.timeSlotInstanceModel = timeSlotInstanceModel;
  }



  async PublishPost(id) {
    const ts = new Date(); // timestamp
    const postData = await this.postModel.findOne({ id });
    let result = {
      message: "",
      url: "",
      date: null
    };

    await axios.post("https://api.linkedin.com/rest/posts",
      {
        "author": `urn:li:person:${postData.linked_in_account_id}`,
        "commentary": postData.text,
        "visibility": "PUBLIC",
        "distribution": {
          "feedDistribution": "MAIN_FEED",
          "targetEntities": [],
          "thirdPartyDistributionChannels": []
        },
        "lifecycleState": "PUBLISHED",
        "isReshareDisabledByAuthor": false
      },
      {
        "headers": {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${postData.linked_in_account.access_token}`,
          "X-Restli-Protocol-Version": "2.0.0",
          "LinkedIn-Version": 202304
        },
    })
    .then((response) => {
      console.log(response.status);
      if(response.status === 201) {
        postEvents.dispatch(events.post.publishPost, { post_id: id, status: "published", 
        published_url: `https://www.linkedin.com/feed/update/${response.headers["x-restli-id"]}`, published_at: result.date,
        published_id: response.headers["x-restli-id"], updated_at: ts });
        result.message = "Published";
        result.url = `https://www.linkedin.com/feed/update/${response.headers["x-restli-id"]}`,
        result.date = response.headers.date
        return result
      }
    })
    .catch((e) => {
      console.log(e);
      handleAPIErrors(e, id)
    })
    return result;
  }

  
    
  async GetPostByID(id) {
    const post = await this.postModel.findOne({ id });
    const timeSlotInstance = await this.timeSlotInstanceModel.findOne({ post_id: id });
    if (!post) {
      let error = new Error("Post doesn't exists.");
      error.statusCode = 400;
      throw error;
    }
    return {
      post,
      time_slot_instance: timeSlotInstance
    };
  }


  async GetPostCount(creator_id, workspace_id) {
    const draft = await this.postModel.find({ creator_id, workspace_id, status: "draft" });
    const failed = await this.postModel.find({ creator_id, workspace_id, status: "failed" });
    const scheduled = await this.postModel.find({ creator_id, workspace_id, status: "scheduled" });
    const inProgress = await this.postModel.find({ creator_id, workspace_id, status: "in_progress" });
    const published = await this.postModel.find({ creator_id, workspace_id, status: "published" });

    // if (!post) {
    //   let error = new Error("Post doesn't exists.");
    //   error.statusCode = 400;
    //   throw error;
    // }

    return {
      draft: draft.length,
      failed: failed.length,
      scheduled: scheduled.length,
      in_progress: inProgress.length,
      published: published.length
    };
  }

  async ListPosts(creator_id, status, page, per_page) {
    // const listPosts = await this.postModel.aggregate([
    //   {$match: {creator_id, status}},
    //   //{$page: page},
    //   //{$project: {id: page, text: page, rich_text: page, status: page, mentions: page, creator_id: page }},
    //   {$limit: Number(per_page)}
    // ]);

    const posts = await this.postModel.aggregate([
      {
        $match: {creator_id, status},
      },
      {
          $facet: {
              metaData: [
                  {
                      $count: "totalDocument"
                  },
                  {
                      $addFields: {
                          pageNumber: page,
                          totalPages: { $ceil: {$divide: ["$totalDocument", per_page] }}
                      }
                  }
              ],
              data: [
                  {
                      $skip: (page - 1) * per_page
                  }, 
                  {
                      $limit: per_page
                  }
              ]
          }
      }
    ]);
    return posts[0].data;
  }


  async CreateDraftPost(data, creator_id, workspace) {
    const linkedin = await this.linkedinModel.find({ workspace_id: workspace });
    const post = await this.postModel.create({
      text: data.text,
      creator_id,
      image_url: data.image_url,
      mentions: data.mentions,
      rich_text: data.rich_text,
      file_url: data.file_url,
      linked_in_account_id: linkedin[0]?.user_id,
      linked_in_account: linkedin[0],
      user: linkedin[0]?.name,
      workspace_id: workspace,
      id: await uuidv4()
    });

    if (!post) {
      let error = new Error("Cannot perform task, try again!");
      error.statusCode = 500;
      throw error;
    }
    return post;
  }

  async DeleteDraftPost(id) {
    const post = await this.postModel.findOneAndDelete({ id });

    if (!post) {
      let error = new Error("Cannot perform task, try again!");
      error.statusCode = 500;
      throw error;
    }
    return post;
  }



  async UpdateDraftPost(data, id) {
    const ts = new Date(); // timestamp
    const post = await this.postModel.findOneAndUpdate({ id }, {
      $set: {
        carousel_title: data.carousel_title,
        text: data.text,
        image_url: data.image_url,
        mentions: data.mentions,
        rich_text: data.rich_text,
        file_url: data.file_url,
        linked_in_account_id: data.linked_in_account_id,
        linked_in_account: data.linked_in_account,
        video_title: data.video_title,
        video_url: data.video_url,
        updated_at: ts
      },
      },
      {
      new: true
    });

    if (!post) {
      let error = new Error("Cannot perform task, try again!");
      error.statusCode = 500;
      throw error;
    }

    if(data.status === "scheduled") {
      postEvents.dispatch(events.post.updateScheduledPost, { post_id: id, status: data.status, timeSlotInstance: data.time_slot_instance });
    }
    return post;
  }
}