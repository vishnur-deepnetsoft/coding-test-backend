import bodyParser from "body-parser";
import express from "express";
import connectDB from "../config/database";
import {suggestionRouter} from "./routes/api/suggestions"
import {seedData} from "./services/suggestions"

const app = express();

// Connect to MongoDB
connectDB();

// Express configuration
app.set("port", process.env.PORT || 5000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



// @route   GET /
// @desc    Test Base API
// @access  Public
app.get("/", (_req, res) => {
  res.send("API Running");
});


app.use(suggestionRouter)


const port = app.get("port");
// const server = app.listen(port, () =>
 
//   console.log(`Server started on port ${port}`)
//   seedData();
// );


app.listen(port, () => {
  console.log(`Server started on port ${port}`)
     seedData();
});

export default app;

