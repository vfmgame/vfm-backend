const userEvents = require("../subscribers/user");
const events = require("../subscribers/events");

module.exports = class GameService {
  constructor(userModel) {
    this.userModel = userModel;
  }

  async StartGame(userId) {
    const ts = new Date(); // timestamp
    const deductedPlayPasses = await this.userModel.findOneAndUpdate({ userId }, {
      $inc: {"wallet.passes": - 1},
      $set: {
        updatedAt: ts
      },
    },
    {
      new: true
    });
    userEvents.dispatch(events.user.deductPlayPass, { userId });
    return deductedPlayPasses;
  }


  async AddUserScore(points, userId) {
    const ts = new Date(); // timestamp
    const updateUserScore = await this.userModel.findOneAndUpdate({ userId }, {
      $inc: { "wallet.points": points},
      $set: {
        updatedAt: ts
      },
    },
    {
      new: true
    });
    userEvents.dispatch(events.user.addPlayScore, { userId, reward: points });
    return updateUserScore;
  }
}