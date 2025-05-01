const userEvents = require("../subscribers/user");
const events = require("../subscribers/events");

module.exports = class UserService {
  constructor(userModel) {
    this.userModel = userModel;
  }


    
  async GetUser(userId) {
    const fetchUser = await this.userModel.findById({ _id: userId });
    return fetchUser;
  }

  async FetchReferral(referralId) {
    const referrals = await this.userModel.find({ referredBy: referralId });
    return referrals;
  }


  async UpdateUserProfile(nickName, userId) {
    const ts = new Date(); // timestamp
    const updateUser = await this.userModel.findByIdAndUpdate({ _id: userId }, {
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
    const updateUser = await this.userModel.findByIdAndUpdate({ _id: userId }, {
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

    const updateUser = await this.userModel.findByIdAndUpdate({ _id: userId }, {
      $set: {
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


  async ClaimReward(type, points, userId) {
    const ts = new Date(); // timestamp
    const updateUser = await this.userModel.findByIdAndUpdate({ _id: userId }, {
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

    userEvents.dispatch(events.user.claimFarmReward, { userId, points, type });
    return updateUser;
  }


  async ClaimDailyReward(data, userId) {
    const ts = new Date(); // timestamp
    const updateDailyReward = await this.userModel.findByIdAndUpdate({ _id: userId }, {
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




  async UploadAvatar(avatar, userId) {
    const ts = new Date(); // timestamp
    const updateAvatar = await this.userModel.findByIdAndUpdate({ _id: userId }, {
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
}