module.exports = class UserService {
  constructor(transactionModel) {
    this.transactionModel = transactionModel;
  }

  async GetTransactions(userId) {
    const transaction = await this.transactionModel.find({ userId });
    return transaction;
  }
}