const { user } = require("./events");
const UserModel = require("../models/User");
const GameModel = require("../models/Game");
const TaskModel = require("../models/Task");
const pulse = require("../jobs/pulse");
const { v4: uuidv4 } = require("uuid");


const EventEmitter = require("events");


class UserEvents extends EventEmitter {
    dispatch(eventName, message) {
      this.emit(eventName, message);
    }
}

const userEvents = new UserEvents();



userEvents.on(user.signUp, async({ referredBy, userId }) => {
    const ts = new Date(); // timestamp

    if(!referredBy) return;

    const user = await UserModel.findOne({ userId });

    if(user.referredBy === referredBy) return;
    
    await UserModel.findOneAndUpdate({ userId }, {
        $set: {
            referredBy,
            updatedAt: ts
        },
        },
    {
        new: true
    });

    await UserModel.findOneAndUpdate({ referralCode: referredBy }, {
        $inc: { referralEarnings: 20 },
        $set: {updatedAt: ts}},
        {new: true});
});



userEvents.on(user.signUp, async({ referredBy, userId }) => {
    await GameModel.create({
        id: await uuidv4(),
        userId,
        scores: 0
    })
});



userEvents.on(user.signUp, async({ referredBy, userId }) => {
    Promise.all([
        TaskModel.create({
            id: await uuidv4(),
            userId,
            type: "social",
            task: "https://web.facebook.com/FilipinoHouseDesignPH",
            description: "Subscribe to us on Facebook",
            reward: 150000
        }),
        TaskModel.create({
            id: await uuidv4(),
            userId,
            type: "social",
            task: "https://t.me/Engineering_EBooks",
            description: "Join our TG-Community",
            reward: 500000
        }),
        TaskModel.create({
            id: await uuidv4(),
            userId,
            type: "social",
            task: "https://www.youtube.com/channel/UCbCmjCuTUZos6Inko4u57UQ",
            description: "Watch us on Youtube",
            reward: 200000
        }),
        TaskModel.create({
            id: await uuidv4(),
            userId,
            type: "social",
            task: "https://x.com/CodeRigiAcademy",
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


userEvents.on(user.login, async({ userId, lastCheckedIn, checkedInDays }) => {
    await pulse.schedule("12am", "claim_daily_bonus", {
        userId
    })
});




// Check day from start date to determine days passed
// When user login run the logic


// Create a user check-in property in DB - Done
// Run Cron Job every 12am to update all checkedIn to false
// Once logged in for a new day, check if checkedIn
// If not checkedIn, check days to determine points
// Change checkedIn to true and add points



// userEvents.on(user.signUp, async({ referredBy, userId }) => {
//     const ts = new Date(); // timestamp

//     // await pulse.every("24 hours", "check_user_trial", {
//     //     userID: user.main_id
//     // })
// });








userEvents.on(user.claimBonus, async({ userId, points }) => {
    const ts = new Date(); // timestamp
    
    const user = await UserModel.findOne({ userId });

    if(user.referredBy === null) return;

    const tenPercent = (points/100) * 10;

    await UserModel.findOneAndUpdate({ referralCode: user.referredBy }, {
        $inc: { referralEarnings: tenPercent },
        $set: {updatedAt: ts}},
    {new: true});
});




  
module.exports = userEvents;