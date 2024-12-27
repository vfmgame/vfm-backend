const { addUser } = require("../helper");

module.exports = (io, socket) => {
  // const createOrder = (payload, callback) => {
  //   console.log(payload);
  //   // ...
  //   const { error, user } = addUser({ id: payload.email, email: payload.email, room: payload.id });

  //   //console.log(user)
      
  //   if(error) return callback(error)

  //   socket.join(user.room);

  //   // socket.emit('message', { user: 'admin', text: `${user.email}, welcome to room ${user.room}.`});
  //   // socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.email} has joined!` });

  //   // io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

  //   callback();
  //   console.log("Order created!");
  // }

  // countDuplicateProspects = async (payload) => {
  //   const prospects = await ProspectModel.findOne({ user_id: payload.id, name: payload.list }).$where("prospects").elemMatch({ handle })
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
  
  
  // const addProspects = async (payload, callback) => {
  //   //console.log(payload);
  //   const ts = new Date(); // timestamp .select({'locations.$': 1});
  //   const prospect = await ProspectModel.findOne({user_id: payload.id, name: payload.list });
  //   const checkDuplicate = prospect.prospects.some(obj => obj.handle === payload.profile.handle);
  //   //findOne({ user_id: payload.id, name: payload.list }, {"prospects.handle":  payload.handle});
  //   if(checkDuplicate) {
  //     //console.log("56");
  //     console.log(checkDuplicate);
  //     let count = 1;
  //     console.log(count++);
  //     io.to(payload.id).emit("prospect:duplicate", { count: 1 });
  //   } else {
  //     await ProspectModel.findOneAndUpdate({ user_id: payload.id, name: payload.list }, {$addToSet: { prospects: payload.profile }, $set: { page: payload.page, updated_at: ts }}, {upsert: true});
  //   }
    
  //   //await ProspectModel.findOneAndUpdate({ user_id: payload.id, name: payload.list }, {$addToSet: { prospects: payload.profile }, $set: { page: payload.page, updated_at: ts }}, {upsert: true});
  //     // ...
    
  //   //console.log(payload);


  //   // Listen for changes
  //   // ProspectModel.watch().on("change", (data) => {
  //   //   if(data) {
  //   //    //io.to(payload.id).emit("prospect:duplicates", { count: 1 });
  //   //    //callback({ count: 1 })
  //   //   }
  //   //   //console.log(new Date(), data);
  //   // });

  //   // const prospect1 = await ProspectModel.create({
  //   //   user_id: "RCP3W2UR6Z24",
  //   //   name: "Awilo"
  //   // });

  //   //{ $set: { page: payload.page, updated_at: ts } },

  //   //const prospect = await ProspectModel.findOneAndUpdate({ user_id: payload.id, name: payload.list }, {$addToSet: { prospects: payload.profile }, $set: { page: payload.page, updated_at: ts }}, {upsert: true});
  //   //const prospect = await ProspectModel.findOne({ user_id: payload.id, name: payload.list })
  //   //console.log(prospect);
      
  // }
  
  // socket.on("add_user", createOrder);
  // socket.on("prospect:add", addProspects);
  // socket.on("prospect:save", addProspects);
  //socket.on("prospect:duplicates", countDuplicateProspects);
}