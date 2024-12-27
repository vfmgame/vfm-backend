const { Router  } = require("express");
const TimeSlotModel = require("../../models/TimeSlot");
const TimeSlotService = require("../../services/TimeSlotService");
const { authentication, authorization } = require("../middleware")
const { sendResponse } = require("../../helper");
const router = Router();
const authRouter = Router();
const { 
  validate,
  create_time_slot_instance
} = require("../middleware/validator");



authRouter.post("/",
  //validate(create_time_slot_instance),
  async (req, res, next) => {
    const { user } = req.body;
    try {
      const timeSlotServiceInstance = new TimeSlotService(TimeSlotModel);
      const timeSlot = await timeSlotServiceInstance.CreateTimeSlot(req.body, user.main_id, user.workspace);
      return sendResponse(req, res, 201, false, timeSlot, "Time Slot created successfully");
    } catch (error) {
      return next(error);
    }
});


authRouter.get("/",
  async (req, res, next) => {
    const { user } = req.body;
    try {
      const timeSlotServiceInstance = new TimeSlotService(TimeSlotModel);
      const timeSlots = await timeSlotServiceInstance.ListTimeSlots(user.main_id, user.workspace);
      return sendResponse(req, res, 200, false, timeSlots, "Time Slot Listed successfully");
    } catch (error) {
      return next(error);
    }
});

authRouter.delete("/",
  async (req, res, next) => {
    const { user } = req.body;
    console.log(req.body);
    try {
      const timeSlotServiceInstance = new TimeSlotService(TimeSlotModel);
      const timeSlots = await timeSlotServiceInstance.DeleteTimeSlots(req.body, user.main_id, user.workspace);
      return sendResponse(req, res, 200, false, timeSlots, "Time Slot Listed successfully");
    } catch (error) {
      return next(error);
    }
});

router.use("/", authentication, authorization, authRouter);

module.exports = router;