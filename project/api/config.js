const { DocumentStore }  = require("ravendb");
require("dotenv").config();

const store = new DocumentStore(process.env.RAVEN_URL, process.env.RAVEN_DB);
store.initialize();

module.exports = store;