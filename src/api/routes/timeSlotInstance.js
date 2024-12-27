const { Router  } = require("express");
const TimeSlotInstanceModel = require("../../models/TimeSlotInstance");
const TimeSlotModel = require("../../models/TimeSlot");
const TimeSlotInstanceService = require("../../services/TimeSlotInstanceService");
const { authentication, authorization } = require("../middleware")
const { sendResponse } = require("../../helper");
const router = Router();
const authRouter = Router();
const { 
  validate,
  create_time_slot_instance
} = require("../middleware/validator");
const { workspace } = require("../../subscribers/events");



authRouter.post("/",
  //validate(create_time_slot_instance),
  async (req, res, next) => {
    const { user } = req.body;
    try {
      const timeSlotInstanceServiceInstance = new TimeSlotInstanceService(TimeSlotInstanceModel, TimeSlotModel);
      const timeSlotInstance = await timeSlotInstanceServiceInstance.CreateTimeSlotInstance(req.body, user.user_id, user.workspace);
      return sendResponse(req, res, 201, false, timeSlotInstance, "Time Slot Instance created successfully");
    } catch (error) {
      return next(error);
    }
});



authRouter.get("/",
  async (req, res, next) => {
    const { user } = req.body;
    try {
      const timeSlotInstanceServiceInstance = new TimeSlotInstanceService(TimeSlotInstanceModel, TimeSlotModel);
      const timeSlotInstance = await timeSlotInstanceServiceInstance.ListTimeSlotsInstance(user.workspace);
      return sendResponse(req, res, 200, false, timeSlotInstance, "Time Slot Instance listed successfully");
    } catch (error) {
      return next(error);
    }
});



authRouter.get("/scheduled",
  async (req, res, next) => {
    const { user } = req.body;
    const { month, year} = req.query;
    try {
      const timeSlotInstanceServiceInstance = new TimeSlotInstanceService(TimeSlotInstanceModel, TimeSlotModel);
      const timeSlotInstance = await timeSlotInstanceServiceInstance.ListCalendarTimeSlotsInstance({ workspace: user.workspace, month, year});
      return sendResponse(req, res, 200, false, timeSlotInstance, "Time Slot Instance listed successfully");
    } catch (error) {
      return next(error);
    }
});



// authRouter.delete("/:id",
//   async (req, res, next) => {
//     const { id } = req.params;
//     try {
//       const TimeSlotInstanceServiceInstance = new TimeSlotInstanceService(TimeSlotInstanceModel);
//       const post = await TimeSlotInstanceServiceInstance.DeleteDraftPost(id);
//       return sendResponse(req, res, 200, false, post, "Post deleted created successfully");
//     } catch (error) {
//       return next(error);
//     }
// });


authRouter.delete("/:id",
  async (req, res, next) => {
    const { user } = req.body;
    const { id } = req.params;
    try {
      const TimeSlotInstanceServiceInstance = new TimeSlotInstanceService(TimeSlotInstanceModel);
      const deleteSchedule = await TimeSlotInstanceServiceInstance.DeleteScheduledPost(id);
      return sendResponse(req, res, 200, false, deleteSchedule, "Deleted Schedule successfully!");
    } catch (error) {
      return next(error)
    }
});


authRouter.delete("/unschedule/:id",
  async (req, res, next) => {
    const { user } = req.body;
    const { id } = req.params;
    try {
      const TimeSlotInstanceServiceInstance = new TimeSlotInstanceService(TimeSlotInstanceModel);
      const deleteSchedule = await TimeSlotInstanceServiceInstance.UnschedulePost(id);
      return sendResponse(req, res, 200, false, deleteSchedule, "Unscheduled post successfully!");
    } catch (error) {
      return next(error)
    }
});





// authRouter.get("/:id",
//   async (req, res, next) => {
//     const { id } = req.params;
//     try {
//       const TimeSlotInstanceServiceInstance = new TimeSlotInstanceService(TimeSlotInstanceModel);
//       const post = await TimeSlotInstanceServiceInstance.GetPostByID(id);
//       return sendResponse(req, res, 200, false, post, "Post fetched!");
//     } catch (error) {
//       return next(error)
//     }
// });



router.use("/", authentication, authorization, authRouter);

module.exports = router;