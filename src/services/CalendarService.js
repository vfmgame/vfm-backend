const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require('uuid');
const { add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  parseISO,
  startOfToday,
  startOfWeek,
  lastDayOfISOWeek,
  getMonth,
} = require("date-fns");

module.exports = class CalendarService {
  constructor(timeSlotModel, timeSlotInstanceModel, postModel, calendarModel) {
    this.timeSlotModel = timeSlotModel;
    this.timeSlotInstanceModel = timeSlotInstanceModel;
    this.postModel = postModel;
    this.calendarModel = calendarModel;
  }


  async CreateCalendar(data) {
    const month = Number(data.month);
    const year = Number(data.year);
    const currentMonth = format(new Date(data.year, data.month), 'MMM-yyyy');
    let firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date());

    const days = eachDayOfInterval({
      start: startOfWeek(firstDayCurrentMonth),
      end: endOfWeek(endOfMonth(firstDayCurrentMonth))
    });


    const calendar = [];
    const time_slots = await this.timeSlotModel.find({ workspace_id: data.workspace, creator_id: data.creator});
    const time_slot_instance = await this.timeSlotInstanceModel.find({workspace_id: data.workspace,
      month, year
    });
    const time_slot_instances = []
    time_slot_instance.forEach( async (time) => {
      delete time._doc.created_at;
      delete time._doc.updated_at;
      delete time._doc._id;
      delete time._doc.__v;
      time_slot_instances.push({
        id: time.id,
        day_of_week: time.day_of_week,
        hour: time.hour,
        minute: time.minute,
        year: time.year,
        time_slot_instance: time,
        post_id: time.post_id,
        post: time.post
      })
    })

    days.map((day, index) => {
      calendar.push({
        day_name: format(day, "EEEE"),
        month_name: format(day, "MMMM"),
        date: `${format(day, "MMMM")} ${format(day, "d")}`,
        day: Number(format(day, 'd')),
        is_today: isToday(day),
        month: Number(format(day, "M")),
        time_slots: time_slot_instances.filter((time_instance) => time_instance.time_slot_instance.day_of_the_month === Number(format(day, 'd'))
        && time_instance.day_of_week === Number(format(day, 'i'))).length > 0 
        ? time_slot_instances.filter((time_instance) => time_instance.time_slot_instance.day_of_the_month === Number(format(day, 'd')) 
        && time_instance.day_of_week === Number(format(day, 'i'))) : 
        time_slots.filter((time_slot) => time_slot.selected && time_slot.day_of_week === Number(format(day, 'i'))),
        year: Number(format(day, "yyyy")),
      })
    })

    return {
      days: calendar
    }
  
  }
    
  async GetCalendar(id) {

  }


  async CreateCalendarV2(calendars, workspace_id, creator_id) {
    const getCalendar = await this.calendarModel.findOne({ month: calendars[9].month, year: calendars[9].year });
    if(getCalendar) {
      return
    }

    const time_slots = await this.timeSlotModel.find({ workspace_id, creator_id });

    calendars.map((calendar, index) => {
      calendar.time_slots = time_slots.filter((time_slot) => time_slot.selected && time_slot.day_of_week ===  calendar.day_of_the_week)
    })

    const createCalendar = await this.calendarModel.create({ days: calendars, month: calendars[9].month, year: calendars[9].year });
    return createCalendar;
  }


  
}