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
    
  async getUser(userId) {
    const fetchUser = await this.userModel.findOne({ userId });
    delete fetchUser._doc._id;
    delete fetchUser._doc.__v;
    return fetchUser;
  }

  async fetchReferral(referral_id) {
    const referrals = await this.userModel.find({ referred_by: referral_id });
    return referrals;
  }


  async farmReward(data) {
    const ts = new Date(); // timestamp

    const formatDate = new Date(data.miningStartedTime);
    const milliseconds = formatDate.getTime();

    const updateUser = await this.userModel.findOneAndUpdate({ userId: data.userId }, {
      $set: {
        isMining: data.isMining,
        miningStartedTime: milliseconds,
        updated_at: ts
      },
      },
      {
        new: true
    });

    if (!updateUser) {
      let error = new Error("Something went wrong. Try again.");
      error.statusCode = 500;
      throw error;
    }
    return updateUser;
  }


  async claimBonus(data) {
    const ts = new Date(); // timestamp

    const updateUser = await this.userModel.findOneAndUpdate({ userId: data.userId }, {
      $set: {
        wallet: {
          points: data.bonus
        },
        claimed_bonus: true,
        updated_at: ts
      },
      },
      {
        new: true
    });

    if (!updateUser) {
      let error = new Error("Something went wrong. Try again.");
      error.statusCode = 500;
      throw error;
    }
    return updateUser;
  }


  async claimReward(data) {
    const ts = new Date(); // timestamp

    const updateUser = await this.userModel.findOneAndUpdate({ userId: data.userId }, {
      $set: {
        wallet: {
          points: data.reward
        },
        isMining: false,
        miningStartedTime: null,
        updated_at: ts
      },
      },
      {
        new: true
    });

    if (!updateUser) {
      let error = new Error("Something went wrong. Try again.");
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