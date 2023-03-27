const express = require("express");
const noteRouter = express.Router();
const { NoteModel } = require("../model/notes.model");
const jwt = require("jsonwebtoken");

noteRouter.get("/", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "masai");
  console.log(decoded);
  try {
    if (decoded) {
      const notes = await NoteModel.find({ userID: decoded.userID });
      res.status(200).send(notes);
    } else {
      res.status(400).send({ msg: err.message });
    }
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
});

noteRouter.post("/add", async (req, res) => {
  const payload = req.body;
  try {
    const note = new NoteModel(payload);
    await note.save();
    res.status(200).send({ msg: "A new note has been added" });
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
});

noteRouter.patch("/update/:noteId", async (req, res) => {
  const { noteId } = req.params;
  const payload = req.body;
  try {
    await NoteModel.findByIdAndUpdate({ _id: noteId }, payload);
    res.status(200).send({ msg: "notes data has been updated" });
  } catch (err) {
    res.status(200).send({ msg: err.message });
  }
});

noteRouter.delete("/delete/:noteId", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "masai");
  const noteID = req.params.noteId;
  const req_id = decoded.userID;
  const note = NoteModel.findOne({ _id: noteID });
  const userID_in_note = note.userID;

  try {
    if (req_id === userID_in_note) {
      await NoteModel.findByIdAndDelete({ _id: noteId });
      res.status(200).send({ msg: "notes data has been deleted" });
    } else {
      res.status(400).send({ msg: "Not Authorised" });
    }
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
});

module.exports = {
  noteRouter,
};
