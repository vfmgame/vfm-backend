const userEvents = require("../subscribers/user");
const events = require("../subscribers/events");
const { v4: uuidv4 } = require("uuid");


module.exports = class AdminService {
  constructor(adminModel, taskModel) {
    this.adminModel = adminModel;
    this.taskModel = taskModel;
  }

    
  async ListTasks(userId) {
    const tasks = await this.taskModel.find({ userId });
    return tasks;
  }


  async CreateTask(sectionType, creator) {
    const task = await this.taskModel.create({
        id: await uuidv4(),
        creatorId: creator,
        sectionType
    })

    return task;
  }

  async CreateSubSection(data) {
    const ts = new Date(); // timestamp
    const users = await this.adminModel.find({}); // Fetch all 
    users.map(async (user) => (
      await this.taskModel.updateMany({ userId: user._id, sectionType: data.sectionType }, {
        $push: { subSections: { title: data.title, tasks: [] }},
        $set: { updatedAt: ts },
      })
    ))
  }

  async CreateSectionTask(data) {
    const ts = new Date(); // timestamp
    const section = await this.taskModel.findOneAndUpdate({ id: data.sectionId }, {
      $push: { "tasks": { id: await uuidv4(),
        ...data }},
      $set: { updatedAt: ts },
    },
    { new: true });
    return section;
  }

  async AddSubSectionTask(data) {
    const ts = new Date(); // timestamp
    const users = await this.adminModel.find({}); // Fetch all 
    users.map(async (user) => (
      await this.taskModel.updateMany({ userId: user._id, sectionType: data.sectionType, 
        "subSections.title": data.subSectionTitle }, {
        $push: { "subSections.$.tasks": { id: await uuidv4(), ...data }},
        $set: { updatedAt: ts },
      },
      { new: true })
    ))
  }


  async StartSubSectionTask(data, userId) {
    const ts = new Date(); // timestamp
  //  const task = await this.taskModel.findOne({ userId, sectionType: "REGULAR",
  //     "subSections.title": data.title, "subSections.tasks.id": data.taskId, })

  //     console.log(task)
      

  //   const task = await this.taskModel.findOneAndUpdate({ userId, sectionType: "REGULAR",
  //     "subSections.title": data.title, "subSections.tasks.id": data.taskId, 
  //   }, 
  //   {
  //     $set: { "subSections.$[i].tasks.$[j].status": "STARTED", updatedAt: ts },
  //   },
  //   {
  //     arrayFilters: [
  //       { "i.title": data.title },
  //       { "j.id": data.taskId }
  //     ]
  //   }
  //   //{ new: true }
  // );

    const task = await this.taskModel.findOneAndUpdate(
      { userId, sectionType: "REGULAR" },
      { $set: { "subSections.$[outer].tasks.$[inner].status": "STARTED" } },
      { arrayFilters: [{ "outer.title": data.title }, { "inner.id": data.taskId }], new: true }
    );

    //console.log(task);
    

    return task;
  }
}