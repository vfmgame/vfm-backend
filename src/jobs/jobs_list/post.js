const axios = require("axios").default;
const postModel = require("../../models/Post");
const timeSlotInstanceModel = require("../../models/TimeSlotInstance");
const handleAPIErrors = require("../../helper/axiosError");
const postEvents = require("../../subscribers/post");
const events = require("../../subscribers/events");


const schedulePost = (pulse) => {
  pulse.define("schedule_post", async (job, done) => {
    const { postID } = job.attrs.data;
    try {
      console.log(`Post to Linkedin post id ${postID}`);
      await postOnLinkedin(postID);
      // Mark the job as completed
      done(undefined, "Success");
    } catch (error) {
      console.error("Failed to publish post:", error);
      done(error);
    }
  },{
    concurrency: 20,
    lockLimit: 20,
    priority: "high",
    lockLifetime: 200000, // 5 minutes
    shouldSaveResult: true,
    attempts: 1, // Retry up to 3 times
    backoff: {
      type: "exponential",
      delay: 3000, // Start with a 2-second delay between retries
    },
  });
}


const postOnLinkedin = async (id) => {
  const ts = new Date();
  const postData = await postModel.findOne({ id });
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
        "LinkedIn-Version": 202306
      },
    })
    .then( async (response) => {
      //console.log(response);
      console.log(response.status);
      if(response.status === 201) {
        // postEvents.dispatch(events.post.publishPost, { post_id: id, status: "published", 
        // published_url: `https://www.linkedin.com/feed/update/${response.headers["x-restli-id"]}`, published_at: response.headers.date,
        // published_id: response.headers["x-restli-id"],
        // updated_at: ts });
        const post = await postModel.findOneAndUpdate({ id }, {
          $set: {
            status: "published",
            published_url: `https://www.linkedin.com/feed/update/${response.headers["x-restli-id"]}`,
            published_at: response.headers.date,
            published_id: response.headers["x-restli-id"],
            updated_at: ts
          },
          },
          {
            new: true
        });

        await timeSlotInstanceModel.findOneAndUpdate({ post_id: id }, {
          $set: {
            post,
            updated_at: ts
          },
          },
          {
            new: true
        });
        
        return response.statusText
      }
      
    })
    .catch( async (error) => {
      console.log(error?.response);
      //postEvents.dispatch(events.post.failedPost, { post_id: id, status: "failed" });
      //postEvents.dispatch(events.post.failedPost, { post_id: id, status: "failed" });
      const ts = new Date();
      await postModel.findOneAndUpdate({ id }, {
        $set: {
          status: "failed",
          updated_at: ts
        },
        },
        {
        new: true
      });
      //handleAPIErrors(error, id);
      return error.response
    })
}

// module.exports = (pulse) => {
  
// };



module.exports = schedulePost;

