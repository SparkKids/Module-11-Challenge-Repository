// Import express
const express = require('express')
// Import modules for /notes
const notesRouter = require('./notes');
// Create app variable to create an instance of express()
const app = express();
// Use our routes
app.use('/notes', notesRouter);
// Export app
module.exports = app;
