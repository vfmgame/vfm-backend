const userEvents = require("../subscribers/user");
const events = require("../subscribers/events");

module.exports = class GameService {
  constructor(userModel, walletModel) {
    this.userModel = userModel;
    this.walletModel = walletModel;
  }

  async StartGame(userId) {
    const ts = new Date(); // timestamp
    const start = await this.walletModel.findOneAndUpdate({ userId, "points.symbol": "PP" }, {
      $inc: { "points.$.balance": -1 },
      $set: { updatedAt: ts },
    },{ new: true });
    userEvents.dispatch(events.user.deductPlayPass, { userId });
    return start;
  }


  async AddUserScore(points, userId) {
    const ts = new Date(); // timestamp
    const updateUserScore = await this.walletModel.findOneAndUpdate({ userId, "points.symbol": "VFM" }, {
      $inc: { "points.$.balance": points },
      $set: { updatedAt: ts },
    },{ new: true });
    userEvents.dispatch(events.user.addPlayScore, { userId, points });
    return updateUserScore;
  }
}