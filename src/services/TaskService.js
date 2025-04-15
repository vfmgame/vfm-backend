const userEvents = require("../subscribers/user");
const events = require("../subscribers/events");

module.exports = class GameService {
  constructor(taskModel, userModel) {
    this.taskModel = taskModel;
    this.userModel = userModel;
  }

    
  async GetUserTasks(userId) {
    const fetchUserTasks = await this.taskModel.find({ userId, status: false });
    return fetchUserTasks;
  }


  async CompleteTask(data, userId) {
    const ts = new Date(); // timestamp
    const updateTask = await this.taskModel.findOneAndUpdate({ id: data.id }, {
      $set: {
        status: true,
        updatedAt: ts
      },
    },
    {
      new: true
    });

    const updateUserWallet = await this.userModel.findOneAndUpdate({ userId }, {
      $inc: { "wallet.points": data.reward, "wallet.passes": data.passes },
      $set: { updatedAt: ts },
    },
    {
      new: true
    });
    if (!updateTask && !updateUserWallet) {
      let error = new Error("Could not complete task! Try again!");
      error.statusCode = 400;
      throw error;
    }
    return updateTask;
  }
}