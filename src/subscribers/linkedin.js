const { linkedin } = require("./events");
const UserWorkspaceModel = require("../models/UserWorkspace");
const UserModel = require("../models/User");
const AccountModel = require("../models/Account");
const LinkedinAccountModel = require("../models/LinkedinAccount");
const UserSettingModel = require("../models/UserSetting");
const WorkspaceModel = require("../models/Workspace");
const WorkspaceMemberModel = require("../models/WorkspaceMember");
const WorkspaceService = require("../services/WorkspaceService");
const EventEmitter = require("events");
const { v4: uuidv4 } = require('uuid');



class LinkedinEvents extends EventEmitter {
  dispatch(eventName, message) {
    this.emit(eventName, message);
  }
}

const linkedinEvents = new LinkedinEvents();



// linkedinEvents.on(linkedin.addAccount, async({ id, main_id, workspace, linkedinProfile, account }) => {
//   const ts = new Date(); // timestamp
//   const linkedin = await LinkedinAccountModel.findOne({ creator_id: main_id, workspace_id: workspace });

//   if(linkedin) {
//     await LinkedinAccountModel.findOneAndUpdate({ creator_id: main_id, workspace_id: workspace }, {
//       $set: {
//         name: linkedinProfile.firstName + " " + linkedinProfile.lastName,
//         avatar_url: linkedinProfile.image,
//         email: linkedinProfile.email,
//         scope: account.scope,
//         access_token: account.access_token,
//         expires_in: account.expires_in,
//         reconnection_needed: false,
//         refresh_token: null,
//         updated_at: ts
//       },
//     },
//     {
//       new: true
//     });
//   }
// });



// linkedinEvents.on(linkedin.addAccount, async({ id, main_id, workspace, linkedinProfile, account }) => {
//   const ts = new Date(); // timestamp

//   //const account = await AccountModel.findOne({ creator_id: main_id });

//   // const findUser = user.linked_in_accounts.filter((user) => user.user_id === linkedinProfile.id)

//   // if(findUser.length > 0) {
//   //   return
//   // }
    
// //   const deductAccount = account.number_of_linked_in_accounts_allowed - 1;

// //   await AccountModel.findOneAndUpdate({ creator_id: main_id }, {
// //     $set: { 
// //       number_of_linked_in_accounts_allowed: deductAccount,
// //       updated_at: ts 
// //     },
// //     },
// //     {
// //     new: true
// // });

//   await UserModel.findOneAndUpdate({ user_id: id, }, {
//       $set: { 
//         name: linkedinProfile.firstName + " " + linkedinProfile.lastName || null,
//         updated_at: ts 
//       },
//       },
//       {
//       new: true
//   });
// });

// linkedinEvents.on(linkedin.addAccount, async({ id, main_id, workspace, linkedinProfile, account }) => {
//   const linkedin = await LinkedinAccountModel.find({ creator_id: main_id, workspace_id: workspace });
//   console.log(linkedin.length);
//   const mainAccount = await AccountModel.findOne({ creator_id: main_id });

//   // if(linkedin.length == mainAccount.number_of_linked_in_accounts_allowed) {
//   //   return
//   // }

//   if(!linkedin.id) {
//     return
//   }

//   if(linkedin.length < mainAccount.number_of_linked_in_accounts_allowed) {
//     await LinkedinAccountModel.create({
//       creator_id: main_id,
//       workspace_id: workspace,
//       email: linkedinProfile.email,
//       user_id: linkedinProfile.id,
//       scope: account.scope,
//       access_token: account.access_token,
//       expires_in: account.expires_in,
//       name: linkedinProfile.firstName + " " + linkedinProfile.lastName,
//       avatar_url: linkedinProfile.image,
//       reconnection_needed: false,
//       refresh_token: null
//     })
//   }
// });

// linkedinEvents.on(linkedin.removeAccount, async({ id, account }) => {
//   const ts = new Date(); // timestamp

//   await UserModel.findOneAndUpdate({ user_id: id }, {
//       $pull: { linked_in_accounts: { user_id: account } },
//       $set: { updated_at: ts },},
//         {
//         new: true
//   });
// });



linkedinEvents.on(linkedin.addAccount, async({ id, main_id, linkedinProfile, workspace, account }) => {
  const ts = new Date(); // timestamp
  const linkedin = await LinkedinAccountModel.find({ creator_id: main_id, workspace_id: workspace });
  const mainAccount = await AccountModel.findOne({ creator_id: main_id });


  if(linkedin) {
    if(linkedin.length < mainAccount.number_of_linked_in_accounts_allowed) {
      await LinkedinAccountModel.create({
        creator_id: main_id,
        workspace_id: workspace,
        avatar_url: linkedinProfile.image,
        name: linkedinProfile.firstName + " " + linkedinProfile.lastName,
        email: linkedinProfile.email,
        user_id: linkedinProfile.id,
        scope: account.scope,
        access_token: account.access_token,
        expires_in: account.expires_in,
        reconnection_needed: false,
        refresh_token: account.refresh_token
      })

      await AccountModel.findOneAndUpdate({ creator_id: main_id }, {
        $set: { 
          number_of_linked_in_accounts_allowed: mainAccount.number_of_linked_in_accounts_allowed - 1,
          updated_at: ts },},
        {
          new: true
      });
    }
    
  } else {
    await LinkedinAccountModel.create({
      creator_id: main_id,
      workspace_id: workspace,
      avatar_url: linkedinProfile.image,
      name: linkedinProfile.firstName + " " + linkedinProfile.lastName,
      email: linkedinProfile.email,
      user_id: linkedinProfile.id,
      scope: account.scope,
      access_token: account.access_token,
      expires_in: account.expires_in,
      reconnection_needed: false,
      refresh_token: account.refresh_token
    })

    await AccountModel.findOneAndUpdate({ creator_id: main_id }, {
      $set: { 
        number_of_linked_in_accounts_allowed: mainAccount.number_of_linked_in_accounts_allowed - 1,
        updated_at: ts },},
      {
        new: true
    });
  }
});


linkedinEvents.on(linkedin.removeAccount, async({ creator_id, account }) => {
  const mainAccount = await AccountModel.findOne({ creator_id });
  const ts = new Date(); // timestamp
  console.log(account);
  await AccountModel.findOneAndUpdate({ creator_id }, {
    $set: { 
      number_of_linked_in_accounts_allowed: mainAccount.number_of_linked_in_accounts_allowed + 1,
      updated_at: ts },},
    {
      new: true
  });
  //await AccountModel.findOneAndRemove({ user_id: account });
});


  
module.exports = linkedinEvents;
