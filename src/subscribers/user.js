const { user } = require("./events");
const UserModel = require("../models/User");
const pulse = require("../jobs/pulse");


const EventEmitter = require("events");

class UserEvents extends EventEmitter {
    dispatch(eventName, message) {
      this.emit(eventName, message);
    }
}

const userEvents = new UserEvents();


userEvents.on(user.signUp, async({ referred_by, userId }) => {
    const ts = new Date(); // timestamp

    const referrer = await UserModel.findOne({ referral_code: referred_by });
    const user = await UserModel.findOne({ userId });

    if(user.referred_by === referred_by) return;
    
    await UserModel.findOneAndUpdate({ userId }, {
        $set: {
            referred_by,
            updated_at: ts
        },
        },
    {
        new: true
    });

    await UserModel.findOneAndUpdate({ referral_code: referred_by }, {
        $set: {
            referral_earnings: referrer.referral_earnings + 20,
            updated_at: ts
        },
        },
    {
        new: true
    });
});



userEvents.on(user.signUp, async({ referred_by, userId }) => {
    const ts = new Date(); // timestamp

    // await pulse.every("24 hours", "check_user_trial", {
    //     userID: user.main_id
    // })
});


userEvents.on(user.verifyEmail, async({ user }) => {
    console.log(user);
    // await pulse.every("10 seconds", "check_user_trial", {
    //   userID: user.main_id
    // });
});






userEvents.on(user.claimBonus, async({ userId, points }) => {
    const ts = new Date(); // timestamp
    
    const user = await UserModel.findOne({ userId });

    if(user.referred_by === null) return;

    const referrer = await UserModel.findOne({ referral_code: user.referred_by });

    const tenPercent = (points/100) * 10;

    await UserModel.findOneAndUpdate({ referral_code: user.referred_by }, {
        $set: {
            referral_earnings: referrer.referral_earnings + 20,
            updated_at: ts
        },
        },
    {
        new: true
    });
});




  
module.exports = userEvents;