import bodyParser from "body-parser";
import express from "express";
import {suggestionRouter} from "./routes/api/suggestions"


const app = express();




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



// @route   GET /
// @desc    Test Base API
// @access  Public
app.get("/", (_req, res) => {
  res.send("API Running");
});


app.use(suggestionRouter)


export default app;

