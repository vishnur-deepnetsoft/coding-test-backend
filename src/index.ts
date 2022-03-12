import app from './server';
import connectDB from "../config/database";
import {seedData} from "./services/suggestions"

// Connect to MongoDB
connectDB();



// Express configuration
app.set("port", process.env.PORT || 5000);
const port = app.get("port");

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
       seedData();
  });