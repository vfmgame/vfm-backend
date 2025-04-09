const { addUser, checkCurrentDate, getNumberOfDays } = require("../helper");
const UserModel = require("../models/User");


module.exports = (io, socket) => {
  const storeUser = (payload, callback) => {
    console.log(payload);
    const { error, user } = addUser({ id: payload.id, userName: payload.userName, room: payload.userId });

    console.log(user)
    if(error) return callback(error);

    socket.join(user.room);
    callback();
    console.log("User added!");
  }

  // countDuplicateProspects = async (payload) => {
  //   const prospects = await ProspectModel.findOne({ userId: payload.id, name: payload.list }).$where("prospects").elemMatch({ handle })
  //   const counts = {};
  
  //   // Iterate through the array
  //   prospects?.prospects.forEach(obj => {
  //     // Convert the object to a string for comparison
  //     const objString = JSON.stringify(obj);
  
  //     // Increment the count for each occurrence
  //     counts[objString] = (counts[objString] || 0) + 1;
  //   });
  
  //   // Count the number of duplicates
  //   let duplicateCount = 0;
  //   for (const key in counts) {
  //     if (counts[key] > 1) {
  //       duplicateCount += counts[key] - 1; // Counting duplicates
  //     }
  //   }
  
  //   return duplicateCount;
  // }


  // await UserModel.findOneAndUpdate({ userId: payload.userId }, {
        //   $inc: { "wallet.points": 10, "wallet.passes": 5 },
        //   $set: {
        //     checkedInDays: numberOfDays,
        //     checkedIn: true,
        //     lastCheckedIn: ts,
        //     updatedAt: ts
        //   }},
        // {new: true});
  
  
  const calculateUserBonus = async (payload, callback) => {
    console.log(payload);
    const ts = new Date();
    const numberOfDays = getNumberOfDays(payload.lastCheckedIn, Date.now());
    const currentDay = checkCurrentDate(Date.now(), payload.lastCheckedIn);
    console.log(currentDay);
    //let newCheckInDay = payload.checkedInDays;

    if(numberOfDays !== payload.checkedInDays && currentDay === true && payload.checkedIn === false) {
      console.log(numberOfDays, "Yes");
      if(numberOfDays === 1) {
        callback({
          points: 10,
          passes: 5,
          numberOfDays
        });
      } else if(numberOfDays === 2) {
        callback({
          points: 20,
          passes: 5,
          numberOfDays
        });
      } else if(numberOfDays === 3) {
        callback({
          points: 30,
          passes: 5,
          numberOfDays
        });

      } else if(numberOfDays === 4) {
        callback({
          points: 40,
          passes: 5,
          numberOfDays
        });

      } else if(numberOfDays === 5) {
        callback({
          points: 50,
          passes: 5,
          numberOfDays
        });

      } else if(numberOfDays === 6) {
        callback({
          points: 60,
          passes: 5,
          numberOfDays
        });
      } else if(numberOfDays === 7) {
        callback({
          points: 70,
          passes: 5,
          numberOfDays
        });
      } else if(numberOfDays > 7) {
        callback({
          points: 70,
          passes: 5,
          numberOfDays
        });
      }
    } else {
      console.log(" This is true");
    }
  }
  
  socket.on("add_user", storeUser);
  socket.on("user_bonus:check", calculateUserBonus);
  // socket.on("prospect:save", addProspects);
  // socket.on("prospect:duplicates", countDuplicateProspects);
}