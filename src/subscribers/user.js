const { user } = require("./events");
const UserModel = require("../models/User");
const TaskModel = require("../models/Task");
const CurrencyModel = require("../models/Currency");
const WalletModel = require("../models/Wallet");
const TransactionModel = require("../models/Transaction");
const pulse = require("../jobs/pulse");
const { v4: uuidv4 } = require("uuid");
const cron = require("node-cron");


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
    const ts = new Date(); // timestamp

    if(!referredBy) return;

    const user = await UserModel.findOne({ userId });

    if(user.referredBy === referredBy) return;
    const currency = await CurrencyModel.findOne({ symbol: "VFM" });
    await TransactionModel.create({
        id: await uuidv4(),
        userId,
        description: "Received referral bonus",
        reward: {
            currencyId: currency.id,
            name: currency.name,
            symbol: currency.symbol,
            imageUrl: currency.imageUrl,
            value: "+20"
        }
    })
});


// userEvents.on(user.signUp, async({ referredBy, userId, timezone }) => {
//     const ts = new Date(); // timestamp
//     // Schedule a task to run every day at 12:00 AM
//     cron.schedule("0 0 * * *", async () => {
//         // Your code to run at 12:00 AM goes here
//         console.log("This runs at 12:00 AM every day");
//         await UserModel.findOneAndUpdate({ userId }, {
//           $set: { 
//             checkedIn: false,
//             updatedAt: ts
//           },
//           },
//         { new: true });
//     }, {
//         scheduled: true,
//         timezone // Replace with your timezone, e.g., "America/Los_Angeles"
//     });
// });




userEvents.on(user.signUp, async({ referredBy, userId }) => {
    const ts = new Date();
    await WalletModel.create({
        userId
    })
    CurrencyModel.find().then((currencies) => {
        currencies.map( async (currency) => {
            await WalletModel.findOneAndUpdate({ userId }, {
                $push: { points: { 
                    currencyId: currency.id,
                    name: currency.name,
                    symbol: currency.symbol,
                    imageUrl: currency.imageUrl,
                    balance: 0,
                    fiatValue: {}
                }},
                $set: { updatedAt: ts },
            },{ new: true });
        })
    })
});



userEvents.on(user.claimBonus, async({ userId, points }) => {
    const ts = new Date(); // timestamp
    const user = await UserModel.findById({ _id: userId });
    if(user.referredBy === null) return;

    const tenPercent = (points/100) * 10;

    await UserModel.findOneAndUpdate({ referralCode: user.referredBy }, {
        $inc: { referralEarnings: tenPercent },
        $set: {updatedAt: ts}},
    {new: true});
});


userEvents.on(user.claimBonus, async({ userId, points }) => {
    const ts = new Date();
    await WalletModel.findOneAndUpdate({ userId, "points.symbol": "VFM"}, {
        $inc: { "points.$.balance": points },
        $set: { updatedAt: ts },
    },{ new: true });
}); 

userEvents.on(user.claimBonus, async({ userId, points }) => {
    const ts = new Date();
    await WalletModel.findOneAndUpdate({ userId, "points.symbol": "PP" }, {
        $inc: { "points.$.balance": 3 },
        $set: { updatedAt: ts },
    },{ new: true });
});


userEvents.on(user.claimBonus, async({ userId, points }) => {
    const currency = await CurrencyModel.findOne({ symbol: "VFM" });
    await TransactionModel.create({
        id: await uuidv4(),
        userId,
        description: "Received from bonus",
        reward: {
            currencyId: currency.id,
            name: currency.name,
            symbol: currency.symbol,
            imageUrl: currency.imageUrl,
            value: `+${points}`
        }
    })
});



userEvents.on(user.claimFarmReward, async({ userId, points }) => {
    const currency = await CurrencyModel.findOne({ symbol: "VFM" });
    await TransactionModel.create({
        id: await uuidv4(),
        userId,
        description: "Receive from farming",
        reward: {
            currencyId: currency.id,
            name: currency.name,
            symbol: currency.symbol,
            imageUrl: currency.imageUrl,
            value: `+${points}`
        }
    })
});


userEvents.on(user.claimDailyReward, async({ userId, points, passes }) => {
    const ts = new Date();
    await WalletModel.findOneAndUpdate({ userId, "points.symbol": "VFM" }, {
        $inc: { "points.$.balance": points },
        $set: { updatedAt: ts },
    },{ new: true });
});


userEvents.on(user.claimDailyReward, async({ userId, points, passes }) => {
    const ts = new Date();
    await WalletModel.findOneAndUpdate({ userId, "points.symbol": "PP" }, {
        $inc: { "points.$.balance": passes },
        $set: { updatedAt: ts },
    },{ new: true });
});


userEvents.on(user.claimDailyReward, async({ userId, points, passes }) => {
    const currency = await CurrencyModel.findOne({ symbol: "VFM" });
    await TransactionModel.create({
        id: await uuidv4(),
        userId,
        description: "Receive from daily rewards",
        reward: {
            currencyId: currency.id,
            name: currency.name,
            symbol: currency.symbol,
            imageUrl: currency.imageUrl,
            value: `+${points}`
        }
    });
});


userEvents.on(user.claimDailyReward, async({ userId, points, passes }) => {
    const currency = await CurrencyModel.findOne({ symbol: "PP" });
    await TransactionModel.create({
        id: await uuidv4(),
        userId,
        description: "Receive from daily rewards",
        reward: {
            currencyId: currency.id,
            name: currency.name,
            symbol: currency.symbol,
            imageUrl: currency.imageUrl,
            value: `+${passes}`
        }
    })
});


userEvents.on(user.deductPlayPass, async({ userId }) => {
    const currency = await CurrencyModel.findOne({ symbol: "PP" });
    await TransactionModel.create({
        id: await uuidv4(),
        userId,
        description: "Spent for drop game",
        reward: {
            currencyId: currency.id,
            name: currency.name,
            symbol: currency.symbol,
            imageUrl: currency.imageUrl,
            value: "-1"
        }
    })
});


userEvents.on(user.addPlayScore, async({ userId, points }) => {
    const currency = await CurrencyModel.findOne({ symbol: "VFM" });
    await TransactionModel.create({
        id: await uuidv4(),
        userId,
        description: "Receive from drop game",
        reward: {
            currencyId: currency.id,
            name: currency.name,
            symbol: currency.symbol,
            imageUrl: currency.imageUrl,
            value: `+${points}`
        }
    })
});




  
module.exports = userEvents;