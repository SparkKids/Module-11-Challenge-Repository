const notes = require('express').Router();
const uuid = require('../helpers/uuid');
// Import helper functions and dependencies
const { readFromFile, readAndAppend } = require('../helpers/fsUtils');
const fscb = require('fs');
const util = require('util');
const writeFile = util.promisify(fscb.writeFile);
const readFile = util.promisify(fscb.readFile);
// GET Route for retrieving all the notes
notes.get('/', (req, res) => {
    console.info(`${req.method} request received for notes`);
    console.log(`request received for notes`);
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
    console.log("After read from file");
  });
  
  // POST Route for a new note
  notes.post('/', (req, res) => {
    console.info(`${req.method} request received to add a note`);
  
    const { title, text } = req.body;
  
    if (title && text) {
      const newNote = {
        title,
        text,
        note_id: uuid(),
      };
  
      readAndAppend(newNote, './db/db.json');
      res.json(`Note added successfully`);
    } else {
      res.status(400).json('Error in adding note: Title and text are required');
    }
  });
  // Delete a note by ID
notes.delete('/:noteId', async (req, res) => {
  console.info(`${req.method} request received to delete a note`);
  console.log("notes.delete req.params.noteId = " + req.params.noteId)
  const noteIdToDelete = req.params.noteId;

  try {
    // Read the current data from the file
    const currentData = await readFile('./db/db.json', 'utf8');
    const dataArray = JSON.parse(currentData);

    // Find the index of the note to delete
    const noteIndex = dataArray.findIndex((note) => note.note_id === noteIdToDelete);

    // If the note is found, remove it from the array
    if (noteIndex !== -1) {
      dataArray.splice(noteIndex, 1);

      // Write the updated data back to the file
      await writeFile('./db/db.json', JSON.stringify(dataArray, null, 2));

      res.json(`Note with ID ${noteIdToDelete} deleted successfully`);
    } else {
      res.status(404).json(`Note with ID ${noteIdToDelete} not found`);
    }
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json('Internal Server Error');
  }
});

  
  
module.exports = notes;
