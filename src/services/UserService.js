const userEvents = require("../subscribers/user");
const events = require("../subscribers/events");

module.exports = class UserService {
  constructor(userModel) {
    this.userModel = userModel;
  }


    
  async getUser(userId) {
    const fetchUser = await this.userModel.findOne({ userId });
    delete fetchUser._doc._id;
    delete fetchUser._doc.__v;
    return fetchUser;
  }

  async FetchReferral(referralId) {
    const referrals = await this.userModel.find({ referredBy: referralId });
    console.log(referrals);
    
    return referrals;
  }


  async UpdateUserProfile(nickName, userId) {
    const ts = new Date(); // timestamp
    const updateUser = await this.userModel.findOneAndUpdate({ userId }, {
      $set: {
        nickName: nickName,
        userVerified: true,
        userVerifiedAt: ts,
        updatedAt: ts
      },
    },
    {
      new: true
    });
    if (!updateUser) {
      let error = new Error("Could not set nickname! Try again!");
      error.statusCode = 400;
      throw error;
    }

    return updateUser;
  }


  async FarmReward(data, userId) {
    const ts = new Date(); // timestamp
    const updateUser = await this.userModel.findOneAndUpdate({ userId }, {
      $set: {
        isMining: data.isMining,
        miningStartedTime: data.miningStartedTime,
        updatedAt: ts
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


  async ClaimBonus(bonus, userId) {
    const ts = new Date(); // timestamp

    const updateUser = await this.userModel.findOneAndUpdate({ userId }, {
      $set: {
        "wallet.points": bonus,
        claimedBonus: true,
        updatedAt: ts
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

    userEvents.dispatch(events.user.claimBonus, { userId, points: bonus });
    return updateUser;
  }


  async ClaimReward(type, reward, userId) {
    const ts = new Date(); // timestamp
    const updateUser = await this.userModel.findOneAndUpdate({ userId }, {
      $inc: { "wallet.points": reward },
      $set: {
        isMining: false,
        miningStartedTime: null,
        updatedAt: ts
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

    userEvents.dispatch(events.user.claimFarmReward, { userId, reward, type });
    return updateUser;
  }


  async ClaimDailyReward(data, userId) {
    const ts = new Date(); // timestamp
    const updateDailyReward = await this.userModel.findOneAndUpdate({ userId }, {
      $inc: { "wallet.points": data.points, "wallet.passes": data.passes,  },
      $set: { 
        checkedInDays: data.numberOfDays,
        checkedIn: true,
        lastCheckedIn: ts,
        updatedAt: ts
      },
      },
      {
        new: true
    });

    if (!updateDailyReward) {
      let error = new Error("Something went wrong. Try again.");
      error.statusCode = 500;
      throw error;
    }
    userEvents.dispatch(events.user.claimDailyReward, { userId, points: data.points, passes: data.passes });
    return updateDailyReward;
  }


  async UpdateNotificationChannels(data, channel) {
    const ts = new Date(); // timestamp

    const updateNotificationChannels = await this.userModel.findOneAndUpdate({ email: data.email }, {
      $set: {
        notification_channel: channel,
        updatedAt: ts
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


  async UploadAvatar(avatar, userId) {
    const ts = new Date(); // timestamp

    const updateAvatar = await this.userModel.findOneAndUpdate({ userId }, {
      $set: {
        avatar,
        updatedAt: ts
      },
      },
      {
        new: true
    });

    if (!updateAvatar) {
      let error = new Error("Cannot update userInfo, try again!");
      error.statusCode = 500;
      throw error;
    }
    return updateAvatar;
  }


  async UpdateUserInfo(data) {
    const ts = new Date(); // timestamp

    const updateUserInfo = await this.userInfoModel.findOneAndUpdate({ userId: data.id }, {
      $set: {
        onboarding_completed: data.onboarding_completed,
        problems_to_solve: data.problems_to_solve,
        source_of_discovery: data.source_of_discovery,
        updatedAt: ts
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

  async FetchUserInfo(userId) {
    const fetchUserInfo = await this.userInfoModel.findOne({ creator_id: userId });
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
        updatedAt: ts
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