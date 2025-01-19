const expressLoader = require("./express");
const mongooseLoader = require("./mongoose");

module.exports = async (app) => {
    // cron.schedule("* * * * * *", () => {
    //     console.log('running every minute 1, 2, 4 and 6');
    // });
 

    await mongooseLoader();
    console.log('MongoDB Intialized');
    await expressLoader(app);
    console.log('Express Intialized');
    // (async function () {
    //     await agenda.start();
    // })();
    // agenda.on('ready', function() {
    //     console.log("Ok Lets get start");
    //     agenda.start();
    // });

    // ... more loaders can be here

    // ... Initialize agenda
    // ... or Redis, or whatever you want
}