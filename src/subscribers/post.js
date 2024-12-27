const { post } = require("./events");
const postModel = require("../models/Post");
const CalendarModel = require("../models/Calendar");
const TimeSlotInstanceModel = require("../models/TimeSlotInstance");
const linkedinModel = require("../models/LinkedinAccount");
// const agenda = require("../loaders/agenda");
const axios = require("axios").default;
const EventEmitter = require("events");
const { handleAPIErrors } = require("../helper");
const events = require("./events");
const pulse = require("../jobs/pulse");



class PostEvents extends EventEmitter {
  dispatch(eventName, message) {
    this.emit(eventName, message);
  }
}

const postEvents = new PostEvents();


postEvents.on(post.unschedulePost, async ({timeSlotInstanceId}) => {
  const ts = new Date(); // timestamp
  await postModel.findOneAndUpdate({ time_slot_instance_id: timeSlotInstanceId }, {
    $set: {
      status: "draft",
      time_slot_instance: null,
      time_slot_instance_id: null,
      updated_at: ts
    },
    },
    {
      new: true
  });
})


postEvents.on(post.publishPost, async ({ post_id, status, published_url, published_at, published_id, updated_at }) => {
  await postModel.findOneAndUpdate({ id: post_id }, {
    $set: {
      status,
      published_url,
      published_at,
      published_id,
      updated_at
    },
    },
    {
      new: true
  });
})


postEvents.on(post.updateScheduledPost, async ({ post_id, status, timeSlotInstance }) => {
  const ts = new Date(); // timestamp
  const post = await postModel.findOne({ id: post_id });

  delete post._doc.__v;
  delete post._doc._id;

  await TimeSlotInstanceModel.findOneAndUpdate({ id: timeSlotInstance.id }, {
    $set: {
      post: post,
      updated_at: ts
    },
    },
    {
    new: true
  });
})


postEvents.on(post.schedulePost, async ({ post_id, status, timeSlotInstance }) => {
  //console.log(status);
  const ts = new Date(); // timestamp
  await postModel.findOneAndUpdate({ id: post_id }, {
    $set: {
      status,
      time_slot_instance: timeSlotInstance,
      time_slot_instance_id: timeSlotInstance.id,
      updated_at: ts
    },
    },
    {
    new: true
  });
})

postEvents.on(post.schedulePost, async ({ post_id, status, timeSlotInstance }) => {
  delete timeSlotInstance._doc.__v;
  delete timeSlotInstance._doc._id;
  delete timeSlotInstance._doc.post;
  const ts = new Date(); // timestamp
  await postModel.findOneAndUpdate({ id: post_id },
    { $set: { status: "scheduled", time_slot_instance_id: timeSlotInstance.id, time_slot_instance: timeSlotInstance, updated_at: ts }},
    {new: true});
})


postEvents.on(post.schedulePost, async ({ post_id, status, timeSlotInstance }) => {
  const ts = new Date(); // timestamp
  const post = await postModel.findOne({ id: post_id });
  await TimeSlotInstanceModel.findOneAndUpdate({ id: timeSlotInstance.id },
    { $set: { post, updated_at: ts }},
    {new: true});
})





postEvents.on(post.schedulePost, async ({ post_id, status, timeSlotInstance }) => {
  delete timeSlotInstance._doc.__v;
  delete timeSlotInstance._doc._id;
  delete timeSlotInstance._doc.post;
  const ts = new Date(); // timestamp
  const post = await postModel.findOne({ id: post_id });

  delete post._doc.__v;
  delete post._doc._id;

  await CalendarModel.findOneAndUpdate({ month: timeSlotInstance.month, year: timeSlotInstance.year },
    { $set: { "days.$[d].time_slots.$[i]": {
        day_of_week: timeSlotInstance.day_of_week,
        id: timeSlotInstance.id,
        hour: timeSlotInstance.hour,
        minute: timeSlotInstance.minute,
        post,
        post_id: post.id,
        time_slot_instance: timeSlotInstance,
        year: timeSlotInstance.year
    } }},
    { arrayFilters: [{"d.day": timeSlotInstance.day_of_the_month }, {"i.id": timeSlotInstance.time_slot_id }],
    new: true
   });
})


postEvents.on(post.schedulePost, async ({ post_id, status, timeSlotInstance }) => {
  const month = timeSlotInstance.month <= 9 ? `0${timeSlotInstance.month}` : timeSlotInstance.month;
  const day_of_the_month = timeSlotInstance.day_of_the_month <= 9 ? `0${timeSlotInstance.day_of_the_month}` : timeSlotInstance.day_of_the_month;
  const hour = timeSlotInstance.hour <= 9 ? `0${timeSlotInstance.hour}` : timeSlotInstance.hour;
  const minute = timeSlotInstance.minute <= 9 ? `0${timeSlotInstance.minute}` : timeSlotInstance.minute;

  const someDate = new Date(`${timeSlotInstance.year}-${month}-${day_of_the_month}T${hour}:${minute}:00`);
  console.log(someDate);
  pulse.schedule(someDate, "schedule_post", {
    postID: post_id,
  });
})


postEvents.on(post.failedPost, async ({ post_id, status }) => {
  const ts = new Date();
  console.log(status);
  await postModel.findOneAndUpdate({ id: post_id }, {
    $set: {
      status,
      updated_at: ts
    },
    },
    {
    new: true
  });
  
})



async function postOnLinkedin(id) {
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
          "LinkedIn-Version": 202304
        },
    })
    .then((response) => {
      console.log(response.status);
      if(response.status === 201) {
        postEvents.dispatch(events.post.publishPost, { post_id: id, status: "published", 
        published_url: `https://www.linkedin.com/feed/update/${response.headers["x-restli-id"]}`, published_at: response.headers.date,
        published_id: response.headers["x-restli-id"],
        updated_at: ts });
        return response.statusText
      }
      
    })
    .catch((error) => {
      console.log(error.response.status);
      postEvents.dispatch(events.post.failedPost, { post_id: id, status: "failed"});
      handleAPIErrors(error, id);
      return error.response.status
    })
}

  
module.exports = postEvents;
