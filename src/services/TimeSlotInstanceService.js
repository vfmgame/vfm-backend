const bcrypt = require("bcryptjs");
const { handleAPIErrors } = require("../helper");
const { v4: uuidv4 } = require("uuid");
const postEvents = require("../subscribers/post");
const workspaceEvents = require("../subscribers/workspace");
const events = require("../subscribers/events");


module.exports = class TimeSlotInstanceService {
  constructor(timeSlotInstanceModel, timeSlotModel) {
    this.timeSlotInstanceModel = timeSlotInstanceModel;
    this.timeSlotModel = timeSlotModel;
  }
  

  async CreateTimeSlotInstance(data, creator_id, workspace) {
    let timeSlot = null;
    if(data.time_slot_id) {
      timeSlot = await this.timeSlotModel.findOne({ id: data.time_slot_id });
    }
    const timeSlotInstance = await this.timeSlotInstanceModel.create({
      id: await uuidv4(),
      creator_id,
      workspace_id: workspace,
      post_id: data.post_id,
      time_slot_id: data.time_slot_id,
      day_of_the_month: data.day_of_the_month,
      day_of_week: data.day_of_week || timeSlot.day_of_week,
      hour: data.hour || timeSlot.hour,
      minute: data.minute || timeSlot.minute,
      month: data.month,
      year: data.year,
    });

    if (!timeSlotInstance) {
      let error = new Error("Cannot perform task, try again!");
      error.statusCode = 500;
      throw error;
    }
    
    postEvents.dispatch(events.post.schedulePost, { post_id: data.post_id, status: "scheduled", timeSlotInstance });

    return timeSlotInstance;
  }

  async ListTimeSlotsInstance(workspace) {
    const time_slots = await this.timeSlotInstanceModel.find({ workspace_id: workspace });
    return time_slots;
  }

  async ListCalendarTimeSlotsInstance(data) {
    const time_slots = await this.timeSlotInstanceModel.find({ workspace_id: data.workspace, 
      month: data.month, year: data.year });
    return time_slots;
  }

  async DeleteDraftPost(id) {
    const post = await this.timeSlotModel.findOneAndDelete({ id });

    if (!post) {
      let error = new Error("Cannot perform task, try again!");
      error.statusCode = 500;
      throw error;
    }
    return post;
  }

  async UnschedulePost(id) {
    console.log(id);
    const deleteSchedule = await this.timeSlotInstanceModel.findOneAndDelete({ id });
    console.log(deleteSchedule);
    if (!deleteSchedule) {
      let error = new Error("Cannot perform task, try again!");
      error.statusCode = 500;
      throw error;
    }

    postEvents.dispatch(events.post.unschedulePost, { timeSlotInstanceId: id });

    return deleteSchedule;
  }


  async DeleteScheduledPost(id) {
    console.log(id);
    const deleteScheduledPost = await this.timeSlotInstanceModel.findOneAndDelete({ id });
    if (!deleteScheduledPost) {
      let error = new Error("Cannot perform task, try again!");
      error.statusCode = 500;
      throw error;
    }
    return deleteScheduledPost;
  }



  async DeleteDraftPos(id) {
    const post = await this.timeSlotModel.findOneAndDelete({ id });

    if (!post) {
      let error = new Error("Cannot perform task, try again!");
      error.statusCode = 500;
      throw error;
    }
    return post;
  }

}