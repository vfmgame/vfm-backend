const { user } = require("./events");
const UserModel = require("../models/User");
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
    Promise.all([
        TaskModel.create({
            id: await uuidv4(),
            userId,
            type: "social",
            icon: "https://cdn.blum.codes/b1336c17-8b26-49dc-9d07-0e1d9eaee9ae/c892ae72-f8c0-4270-8abc-0e5630c3b078",
            category: "instant",
            task: "https://web.facebook.com/FilipinoHouseDesignPH",
            description: "Subscribe to us on Facebook",
            reward: 20
        }),
        TaskModel.create({
            id: await uuidv4(),
            userId,
            type: "social",
            icon: "https://cdn.blum.codes/10645bfc-3c45-4b86-be2b-53ffe59fbf0f/cc5ccd00-b1ac-498c-85bd-c9d59cb6916a",
            category: "instant",
            task: "https://t.me/Engineering_EBooks",
            description: "Join our TG-Community",
            reward: 20
        }),
        TaskModel.create({
            id: await uuidv4(),
            userId,
            type: "social",
            icon: "https://cdn.blum.codes/d72d558b-ce90-4e80-8dd8-109a134fe36a/c11fe842-e014-4ae2-94d7-f93e2cfd3ed5",
            category: "instant",
            task: "https://www.youtube.com/channel/UCbCmjCuTUZos6Inko4u57UQ",
            description: "Watch us on Youtube",
            reward: 20
        }),
        TaskModel.create({
            id: await uuidv4(),
            userId,
            type: "social",
            icon: "https://cdn.blum.codes/13f2f4ae-8e2e-4eae-b5ee-ce7decc24cf3/7b0ff485-33e7-43ec-8213-1941110f9e5f",
            category: "instant",
            task: "https://x.com/CodeRigiAcademy",
            description: "Check our X account",
            reward: 20
        }),
        TaskModel.create({
            id: await uuidv4(),
            userId,
            type: "refer",
            icon: "",
            category: "instant",
            task: "https://x.com/boringcreatives",
            description: "Invite 5 friends",
            reward: 10
        }),
        TaskModel.create({
            id: await uuidv4(),
            userId,
            type: "refer",
            icon: "",
            category: "instant",
            task: "https://x.com/boringcreatives",
            description: "Invite 10 friends",
            reward: 10
        }),
        TaskModel.create({
            id: await uuidv4(),
            userId,
            type: "refer",
            icon: "",
            category: "instant",
            task: "https://x.com/boringcreatives",
            description: "Invite 20 friends",
            reward: 10
        }),
        TaskModel.create({
            id: await uuidv4(),
            userId,
            type: "refer",
            icon: "",
            category: "instant",
            task: "https://x.com/boringcreatives",
            description: "Invite 30 friends",
            reward: 10
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