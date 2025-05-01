const userEvents = require("../subscribers/user");
const events = require("../subscribers/events");

module.exports = class TaskService {
  constructor(taskModel, userModel) {
    this.taskModel = taskModel;
    this.userModel = userModel;
  }

    
  async GetUserTasks(userId) {
    const fetchUserTasks = await this.taskModel.find({ userId });
    const sortedTasks = fetchUserTasks.map(task => {
      task.subSections = task.subSections.map(sub => {
        sub.tasks.sort((a, b) => {
          if (a.status === "FINISHED" && b.status !== "FINISHED") return 1;
          if (a.status !== "FINISHED" && b.status === "FINISHED") return -1;
          return 0;
        });
        return sub;
      });
      return task;
    });
    await Promise.all(sortedTasks.map(doc => doc.save()));
    return sortedTasks;
  }


  async CompleteTask(data, userId) {
    const task = await this.taskModel.create({
      
    })
  }

  async AddSubSectionTask(data) {
    const ts = new Date(); // timestamp
    // const subSection = await this.sectionModel.findOneAndUpdate({ id: data.id }, {
    //   $push: { "subSections.0.tasks": { ...data.task }},
    //   $set: { updatedAt: ts },
    // },
    // { new: true });
    // return subSection;
  }

  async StartSubSectionTask(data, userId) {
    const ts = new Date(); // timestamp
    const task = await this.taskModel.findOneAndUpdate(
      { _id: data.id, userId},
      { $set: { "subSections.$[outer].tasks.$[inner].status": "STARTED" } },
      { arrayFilters: [{ "outer._id": data.subSectionId }, { "inner._id": data.taskId }], new: true }
    );
    return task;
  }
}