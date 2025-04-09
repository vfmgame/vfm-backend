const userEvents = require("../subscribers/user");
const events = require("../subscribers/events");

module.exports = class GameService {
  constructor(gameModel, userModel) {
    this.gameModel = gameModel;
    this.userModel = userModel;
  }

    
  async GetUserScore(userId) {
    const fetchUserScore = await this.gameModel.findOne({ userId });
    return fetchUserScore;
  }


  async AddUserScore(data, userId) {
    const ts = new Date(); // timestamp
    const updateUserScore = await this.gameModel.findOneAndUpdate({ userId }, {
      $set: {
        score: data.score,
        paused: data.paused,
        updatedAt: ts
      },
    },
    {
      new: true
    });
    if (!updateUserScore) {
      let error = new Error("Could not set nickname! Try again!");
      error.statusCode = 400;
      throw error;
    }
    return updateUserScore;
  }
}