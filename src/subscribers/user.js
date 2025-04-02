const { user } = require("./events");
const UserModel = require("../models/User");
const GameModel = require("../models/Game");
const TaskModel = require("../models/Task");
const pulse = require("../jobs/pulse");
const { v4: uuidv4 } = require("uuid");


const EventEmitter = require("events");
const { generateUniqueId } = require("../helper");

class UserEvents extends EventEmitter {
    dispatch(eventName, message) {
      this.emit(eventName, message);
    }
}

const userEvents = new UserEvents();


userEvents.on(user.signUp, async({ referred_by, userId }) => {
    const ts = new Date(); // timestamp

    if(!referred_by) return;

    console.log(userId + "user");

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
    await GameModel.create({
        id: await uuidv4(),
        userId,
        scores: 0
    })
});


userEvents.on(user.signUp, async({ referred_by, userId }) => {
    Promise.all([
        TaskModel.create({
            id: await uuidv4(),
            userId,
            type: "social",
            task: "https://facebook.com/boringcreatives",
            description: "Subscribe to us on Facebook",
            reward: 150000
        }),
        TaskModel.create({
            id: await uuidv4(),
            userId,
            type: "social",
            task: "https://facebook.com/boringcreatives",
            description: "Join our TG-Community",
            reward: 150000
        }),
        TaskModel.create({
            id: await uuidv4(),
            userId,
            type: "social",
            task: "https://youtube.com/boringcreatives",
            description: "Watch us on Youtube",
            reward: 200000
        }),
        TaskModel.create({
            id: await uuidv4(),
            userId,
            type: "social",
            task: "https://x.com/boringcreatives",
            description: "Check our X account",
            reward: 300000
        }),
        TaskModel.create({
            id: await uuidv4(),
            userId,
            type: "refer",
            task: "https://x.com/boringcreatives",
            description: "Invite 5 friends",
            reward: 10
        }),
        TaskModel.create({
            id: await uuidv4(),
            userId,
            type: "refer",
            task: "https://x.com/boringcreatives",
            description: "Invite 10 friends",
            reward: 50
        }),
        TaskModel.create({
            id: await uuidv4(),
            userId,
            type: "refer",
            task: "https://x.com/boringcreatives",
            description: "Invite 20 friends",
            reward: 80
        }),
        TaskModel.create({
            id: await uuidv4(),
            userId,
            type: "refer",
            task: "https://x.com/boringcreatives",
            description: "Invite 30 friends",
            reward: 100
        })
    ]).then(async () =>
        console.log("Tasks Added"), 
    )
});



// userEvents.on(user.signUp, async({ referred_by, userId }) => {
//     const ts = new Date(); // timestamp

//     // await pulse.every("24 hours", "check_user_trial", {
//     //     userID: user.main_id
//     // })
// });








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