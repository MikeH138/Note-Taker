// Declaring dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");
const notePad = require("./db/db.json");
const uuid = require("uuid");


// Initializing the express app and assigning a port
const app = express();
let PORT = process.env.PORT || 3000;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


// API routes
app.get("/api/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./db/db.json"))
});

app.post("/api/notes", (req, res) => {
  const notePad = JSON.parse(fs.readFileSync("./db/db.json"));
  const addNote = req.body;
  addNote.id = uuid.v4();
  notePad.push(addNote);
  fs.writeFileSync("./db/db.json", JSON.stringify(notePad));
  res.json(notePad);
});

// Function which handles the deletion of stored notes
app.delete("/api/notes/:id", (req, res) => {
  const notePad = JSON.parse(fs.readFileSync("./db/db.json"));
  const deleteNote = notePad.filter((noteDeleted) => noteDeleted.id !== req.params.id);
  fs.writeFileSync("./db/db.json", JSON.stringify(deleteNote));
  res.json(deleteNote);
});


// HTML routes
// Sets up the route for the main/landing page to index.html
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// Route to set the "url/notes" to the notes.html page
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// Starts the server on port 3000
app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});