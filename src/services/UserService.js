const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require('uuid');

module.exports = class UserService {
  constructor(userModel, accountModel, subscriptionModel, userInfoModel, userSettingModel, linkedinModel) {
    this.userModel = userModel;
    this.accountModel = accountModel;
    this.subscriptionModel = subscriptionModel;
    this.userInfoModel = userInfoModel;
    this.userSettingModel = userSettingModel;
    this.linkedinModel = linkedinModel;
  }


  async GetUserSetting() {
    const userSettings = await this.userModel.findOne();
    return userSettings;
  }
    
  async getUser(user_id, main_id) {
    const fetchUser = await this.userModel.findOne({ user_id: user_id });
    console.log(user_id);
    console.log(main_id);
    const account = await this.accountModel.findOne({ creator_id: main_id });
    const subscription = await this.subscriptionModel.findOne({ creator_id: main_id });
    const linkedinAccounts = await this.linkedinModel.find({ creator_id: main_id });
    if (!fetchUser) {
      let error = new Error("Account doesn't exists.");
      error.statusCode = 400;
      throw error;
    }
    
    const filteredAccounts = linkedinAccounts.filter(account => delete account._doc.access_token)
    .filter(account => delete account._doc.scope)
    .filter(account => delete account._doc.expires_in)
    .filter(account => delete account._doc.refresh_token);




    delete account._doc.updated_at;
    delete account._doc.created_at;
    delete account._doc._id;
    delete account._doc.__v;

    account._doc.user = {
      user_id: fetchUser.user_id,
      avatar: fetchUser.avatar,
      name: fetchUser.name,
      email: fetchUser.email,
      role: fetchUser.user_type,
      created_at: fetchUser.created_at,
      updated_at: fetchUser.updated_at
    };
    account._doc.linked_in_accounts = filteredAccounts;
    account._doc.subscription = subscription;

    return account;
  }


  async updatePassword(data, body) {
    const ts = new Date(); // timestamp
    
    const hashedPassword = bcrypt.compareSync(body.old_password, data.password);

    if(!hashedPassword) {
      let error = new Error("Wrong old password!");
      error.statusCode = 400;
      throw error;
    }

    const _password = await bcrypt.hash(body.password, 10);

    const updateUser = await this.userModel.findOneAndUpdate({ email: data.email }, {
      $set: {
        password: _password,
        updated_at: ts
      },
      },
      {
        new: true
    });

    if (!updateUser) {
      let error = new Error("Password cannot be updated. Try again.");
      error.statusCode = 500;
      throw error;
    }
    return updateUser;
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


  async CreateUserInfo(data, user_id) {
    const userInfo = await this.userInfoModel.create({
      id: await uuidv4(),
      creator_id: user_id,
      onboarding_completed: data.onboarding_completed,
      problems_to_solve: data.problems_to_solve,
      source_of_discovery: data.source_of_discovery
    });

    if (!userInfo) {
      let error = new Error("Cannot create userInfo, try again!");
      error.statusCode = 500;
      throw error;
    }
    return userInfo;
  }


  async UpdateUserInfo(data) {
    const ts = new Date(); // timestamp

    const updateUserInfo = await this.userInfoModel.findOneAndUpdate({ user_id: data.id }, {
      $set: {
        onboarding_completed: data.onboarding_completed,
        problems_to_solve: data.problems_to_solve,
        source_of_discovery: data.source_of_discovery,
        updated_at: ts
      },
      },
      {
        new: true
    });

    if (!updateUserInfo) {
      let error = new Error("Cannot perform task, try again.");
      error.statusCode = 500;
      throw error;
    }
    return updateUserInfo;
  }

  async FetchUserInfo(user_id) {
    const fetchUserInfo = await this.userInfoModel.findOne({ creator_id: user_id });
    return fetchUserInfo;
  }



  async UpdateUserSettings(data, id) {
    const ts = new Date(); // timestamp

    const updateUserSetting = await this.userSettingModel.findOneAndUpdate({ id }, {
      $set: {
        enable_personalised_post_generation: data.enable_personalised_post_generation,
        language: data.language,
        timezone: data.timezone,
        role: data.role,
        topics: data.topics,
        workspace_id: data.workspace_id,
        updated_at: ts
      },
      },
      {
        new: true
    });

    if (!updateUserSetting) {
      let error = new Error("Cannot perform task, try again.");
      error.statusCode = 500;
      throw error;
    }
    return updateUserSetting;
  }



  async FetchUserSettings(id) {
    const fetchUserSettings = await this.userSettingModel.findOne({ workspace_id: id });
    delete fetchUserSettings._doc._id;
    delete fetchUserSettings._doc.__v;
    return fetchUserSettings;
  }
}