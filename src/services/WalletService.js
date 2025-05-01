const userEvents = require("../subscribers/user");
const events = require("../subscribers/events");

module.exports = class WalletService {
  constructor(walletModel) {
    this.walletModel = walletModel;
  }


  async FetchBalance(userId) {
    const balance = await this.walletModel.findOne({ userId });
    return balance;
  }
}