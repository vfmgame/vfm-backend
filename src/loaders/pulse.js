const Pulse = require("@pulsecron/pulse").Pulse;
const Secrets = require("../config");


const pulseConfig = {
  processEvery: "1 minute",
  maxConcurrency: 10,
  db: {
    address: "mongodb+srv://essien:Coding3719.@cluster0.ygjpk.mongodb.net/vfm?retryWrites=true&w=majority&appName=Cluster0",
    collection: 'jobs'
  },
  resumeOnRestart: true
};
const pulse = new Pulse(pulseConfig, (error, collection) => {
  if (error) {
    console.error('Connection error:', error);
  } else {
    console.log('Connected to MongoDB collection:', collection.collectionName);
  }
});


/**
 * Check job start and completion/failure
 */
pulse.on('start', (job) => {
  console.log(time(), `Job <${job.attrs.name}> starting`);
});
pulse.on('success', (job) => {
  console.log(time(), `Job <${job.attrs.name}> succeeded`);
});
pulse.on('fail', (error, job) => {
  console.log(time(), `Job <${job.attrs.name}> failed:`, error);
});
  
function time() {
  return new Date().toTimeString().split(' ')[0];
}
  

module.exports = pulse;


