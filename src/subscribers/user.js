const { user } = require("./events");
const UserModel = require("../models/User");


const EventEmitter = require("events");

class UserEvents extends EventEmitter {
    dispatch(eventName, message) {
      this.emit(eventName, message);
    }
}

const userEvents = new UserEvents();


userEvents.on(user.signUp, async({ referred_by, userId }) => {
    const ts = new Date(); // timestamp
    
    await UserModel.findOneAndUpdate({ userId }, {
        $set: {
            referred_by,
            updated_at: ts
        },
        },
    {
        new: true
    });


    const user = await UserModel.findOne({ referral_code: referred_by });

    await UserModel.findOneAndUpdate({ referral_code: referred_by }, {
        $set: {
            referral_earnings: user.referral_earnings + 20,
            updated_at: ts
        },
        },
    {
        new: true
    });
});




  
module.exports = userEvents;