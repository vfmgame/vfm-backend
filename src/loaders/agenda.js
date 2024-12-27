const Agenda = require("agenda");
const Secrets = require("../config");

const agenda = new Agenda({ processEvery: '30 seconds', db: { address: Secrets.DATABASE_LOCAL_URL, collection: 'cronjobs' } });

module.exports = agenda;