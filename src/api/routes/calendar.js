const { Router  } = require("express");
const CalendarModel = require("../../models/Calendar");
const PostModel = require("../../models/Post");
const TimeSlotModel = require("../../models/TimeSlot");
const TimeSlotInstanceModel = require("../../models/TimeSlotInstance");
const CalendarService = require("../../services/CalendarService");
const { authentication, authorization } = require("../middleware");
const { sendResponse } = require("../../helper");
const { workspace } = require("../../subscribers/events");
const router = Router();
const authRouter = Router();


authRouter.get("/v2",
  async (req, res, next) => {
    const { user } = req.body;
    const { month, year } = req.query;
    try {
      const calendarServiceInstance = new CalendarService(TimeSlotModel, TimeSlotInstanceModel, PostModel, CalendarModel);
      const calendar = await calendarServiceInstance.CreateCalendar({ workspace: user.workspace, 
        creator: user.main_id, month, year
       });
      return sendResponse(req, res, 200, false, calendar, "Calendar created Successful");
    } catch (error) {
      console.log(error);
      return next(error);
    }
});

authRouter.post("/v2",
  async (req, res, next) => {
    const { user } = req.body;
    const { month, year } = req.query;
    try {
      const calendarServiceInstance = new CalendarService(TimeSlotModel, TimeSlotInstanceModel, PostModel, CalendarModel);
      const calendar = await calendarServiceInstance.CreateCalendar({ workspace: user.workspace, 
        creator_id: user.main_id, month, year
       });
      return sendResponse(req, res, 200, false, calendar, "Calendar created Successful");
    } catch (error) {
      console.log(error);
      return next(error);
    }
});



router.use("/", authentication, authorization, authRouter);

module.exports = router;