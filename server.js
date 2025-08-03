const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors()); // allow requests from http://localhost:3000 (CRA default)

// "DB" in memory (paste your exact data as provided)
const activities = [
  {
    project:  { id: 1, name: "Mars Rover" },
    employee: { id: 1, name: "Mario" },
    date: "2021-08-26T22:00:00.000Z",
    hours: 5
  },
  {
    project:  { id: 2, name: "Manhattan" },
    employee: { id: 2, name: "Giovanni" },
    date: "2021-08-30T22:00:00.000Z",
    hours: 3
  },
  {
    project:  { id: 1, name: "Mars Rover" },
    employee: { id: 1, name: "Mario" },
    date: "2021-08-31T22:00:00.000Z",
    hours: 3
  },
  {
    project:  { id: 1, name: "Mars Rover" },
    employee: { id: 3, name: "Lucia" },
    date: "2021-08-31T22:00:00.000Z",
    hours: 3
  },
  {
    project:  { id: 2, name: "Manhattan" },
    employee: { id: 1, name: "Mario" },
    date: "2021-08-26T22:00:00.000Z",
    hours: 2
  },
  {
    project:  { id: 2, name: "Manhattan" },
    employee: { id: 2, name: "Giovanni" },
    date: "2021-08-31T22:00:00.000Z",
    hours: 4
  }
];

// GET only
//I want to add a new endpoint to get the activities by project. 
app.get("/api/activities", (req, res) => {
  res.json(activities);
});



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server is listening on http://localhost:${PORT}`));
