const pulse = require("../loaders/pulse");

// list the different jobs availale throughout your app
// if you are adding the job types dynamically and saving them in the database you will get it here
let jobTypes = ["user"];

// loop through the job_list folder and pass in the pulse instance
jobTypes.forEach((type) => {
  // the type name should match the file name in the jobs_list folder
  require("./jobs_list/" + type)(pulse);
});

if (jobTypes.length) {
  // if there are jobs in the jobsTypes array set up
  pulse.on("ready", async () => await pulse.start());
}


async function graceful() {
  await pulse.stop();
  process.exit(0);
}
  

process.on("SIGTERM", graceful);
process.on("SIGINT", graceful);
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  graceful();
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception thrown', error);
  graceful();
});

module.exports = pulse;