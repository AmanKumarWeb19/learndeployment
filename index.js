const express = require("express");
const app = express();
require("dotenv").config();
const { connection } = require("./config/db");
const { userRouter } = require("./routes/users.routes");
const { noteRouter } = require("./routes/notes.routes");
const { auth } = require("./middleware/auth.middleware");
const cors = require("cors");

app.get("/", (req, res) => {
  res.send("Home Page");
});

app.use(express.json());
app.use(cors());
app.use("/users", userRouter);
app.use(auth);
app.use("/notes", noteRouter);



app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("Connected to MONGO DB");
  } catch (err) {
    console.log(err);
  }
  console.log(`Server is running at ${process.env.port}`);
});
