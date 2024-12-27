const bcrypt = require("bcryptjs");

module.exports = class NotificationService {
  constructor(notificationModel){
    this.notificationModel = notificationModel;
  }
    
  async getNotifications(id) {
    const fetchUser = await this.notificationModel.findOne({ _id: id });
    if (!fetchUser) {
      let error = new Error("Account doesn't exists.");
      error.statusCode = 400;
      throw error;
    }
    return fetchUser;
  }



  async UpdateNotificationChannels(data, channel) {
    const ts = new Date(); // timestamp

    const updateNotificationChannels = await this.userModel.findOneAndUpdate({ email: data.email }, {
      $set: {
        notification_channel: channel,
        updated_at: ts
      },
      },
      {
        new: true
    });

    if (!updateNotificationChannels) {
      let error = new Error("Cannot perform task, try again.");
      error.statusCode = 500;
      throw error;
    }
    return updateNotificationChannels;
  }


  async CreateNotification(data, user) {
    const notification = await this.notificationModel.create({
      title: data.title,
      user: user,
      text: data.text,
      action: data.action
    });

    if (!notification) {
      let error = new Error("Cannot perform task, try again!");
      error.statusCode = 500;
      throw error;
    }
    return notification;
  }
}