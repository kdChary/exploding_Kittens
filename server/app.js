const express = require("express");
const path = require("path");

const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());
app.use(cors());

let db = null;

// creating a server and connecting to port 3000
const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: path.join(__dirname, "user.db"),
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log(`Server running at http://localhost:3000/`);
    });
  } catch (error) {
    console.log(`Data Base Error => ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();
