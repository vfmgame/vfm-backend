const bcrypt = require("bcryptjs");
const { handleAPIErrors } = require("../helper");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios").default;

module.exports = class TimeSlotService {
  constructor(timeSlotModel, timeSlotInstanceModel) {
    this.timeSlotModel = timeSlotModel;
    this.timeSlotInstanceModel = timeSlotInstanceModel;
  }

  async CreateTimeSlot(data, creator_id, workspace) {
    const ts = new Date(); // timestamp
    const availableSlots = await this.timeSlotModel.find({ hour: data.hour, minute: data.minute });
    const slotExists = await this.timeSlotModel.findOne({ hour: data.hour, minute: data.minute, day_of_week: data.day_of_week, selected: true, workspace_id: workspace });
    const slotNull = await this.timeSlotModel.findOne({ id: null, hour: data.hour, minute: data.minute, day_of_week: data.day_of_week, selected: false, workspace_id: workspace });
    if(slotExists) {
      let error = new Error("Time slot already exists");
      error.statusCode = 400;
      throw error;
    }

    let day = null;

    switch (data.day_of_week) {
      case 0:
        day = "Sun"
        break;
      case 1:
        day = "Mon"
        break;
      case 2:
        day = "Tue"
        break;
      case 3:
        day = "Wed"
        break;
      case 4:
        day = "Thu"
        break;
      case 5:
        day = "Fri"
        break;
      case 6:
        day = "Sat"
        break;
      default:
        break;
    }



    if(slotNull) {
      const slot = await this.timeSlotModel.findOneAndUpdate({ hour: data.hour, minute: data.minute, day_of_week: data.day_of_week, selected: false, workspace_id: workspace }, {
        $set: {
          id: await uuidv4(),
          creator_id,
          workspace_id: workspace,
          hour: data.hour,
          minute: data.minute,
          day_of_week: data.day_of_week,
          day: day,
          selected: true,
          updated_at: ts
        },
        },
      {
        new: true
      });

      return {
        id: slot.id,
        day_of_week: data.day_of_week,
        creator_id: slot.creator_id,
        hour: slot.hour,
        minute: slot.minute,
        workspace_id: slot.workspace_id,
        created_at: slot.created_at,
        updated_at: slot.updated_at
      };
    }


    if(availableSlots.length == 0) {
      const timeSlots = await this.timeSlotModel.insertMany([
        {
          id: await uuidv4(),
          creator_id,
          workspace_id: workspace,
          hour: data.hour,
          minute: data.minute,
          day_of_week: 1,
          day: "Mon",
          selected: true
        },
        {
          id: null,
          creator_id,
          workspace_id: workspace,
          hour: data.hour,
          minute: data.minute,
          day_of_week: 2,
          day: "Tue",
          selected: false
        },
        {
          creator_id,
          workspace_id: workspace,
          hour: data.hour,
          minute: data.minute,
          day_of_week: 3,
          day: "Wed",
          selected: false,
          id: null
        },
        {
          creator_id,
          workspace_id: workspace,
          hour: data.hour,
          minute: data.minute,
          day_of_week: 4,
          day: "Thu",
          selected: false,
          id: null
        },
        {
          id: null,
          creator_id,
          workspace_id: workspace,
          hour: data.hour,
          minute: data.minute,
          day_of_week: 5,
          day: "Fri",
          selected: false
        },
        {
          id: null,
          creator_id,
          workspace_id: workspace,
          hour: data.hour,
          minute: data.minute,
          day_of_week: 6,
          day: "Sat",
          selected: false
        },
        {
          id: null,
          creator_id,
          workspace_id: workspace,
          hour: data.hour,
          minute: data.minute,
          day_of_week: 0,
          day: "Sun",
          selected: false
        }
      ]);
  
      if (!timeSlots) {
        let error = new Error("Cannot perform task, try again!");
        error.statusCode = 500;
        throw error;
      }
  
      const timeSlotId = timeSlots.filter((day) => day.day_of_week === data.day_of_week);
      return {
        id: timeSlotId[0].id,
        day_of_week: data.day_of_week,
        creator_id: timeSlots[0].creator_id,
        hour: timeSlots[0].hour,
        minute: timeSlots[0].minute,
        workspace_id: timeSlots[0].workspace_id,
        created_at: timeSlots[0].created_at,
        updated_at: timeSlots[0].updated_at
      };
    }


    
  }

  async ListTimeSlots(creator_id, workspace) {
    const timeSlots = await this.timeSlotModel.find({ creator_id, workspace_id: workspace });
    const slotTimes = timeSlots.filter((day) => day.id !== null);
    const time_slots = [];
    const timeslots = [];
    for (let index = 0; index < timeSlots.length; index++) {
      const hour = timeSlots[index].hour;
      const minute = timeSlots[index].minute;
      const timeSlot = time_slots.filter((day) => day.hour === timeSlots[index].hour && day.minute === timeSlots[index].minute);
      
      if(timeSlot.length == 0) {
        const daySlot = timeSlots.filter((day) =>  day.hour === timeSlots[index].hour
          && day.minute === timeSlots[index].minute);
        time_slots.push({ days: daySlot, hour, minute, time:`${hour < 10 ? 0 : ""}${hour > 12 ? hour - 12 : hour}:${minute < 10 ? "0" + minute : minute}${hour >= 12 ? "PM" : "AM"}` });
        timeslots.push(daySlot);
      }
      continue;
    }

    const times = time_slots.filter((day) => day.id !== null);

    return {
      time_slots: time_slots,
      slots: slotTimes,
      timeslots: timeslots
    };
  }

  async DeleteTimeSlots(data, creator_id, workspace,) {
    const timeSlots = await this.timeSlotModel.deleteMany({ hour: data.hour, minute: data.minute, creator_id, workspace_id: workspace });
    return timeSlots;
  }
}
