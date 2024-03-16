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

// API for user registration..
app.post("/register", async (request, response) => {
  const { username, name, age, password } = request.body;
  const findUserQuery = `SELECT username FROM user WHERE username = '${username}';`;
  const existingUser = await db.get(findUserQuery);

  if (existingUser !== undefined) {
    response.status(400);
    response.send("User already exists");
  } else {
    if (password.length > 5) {
      const hashedPassword = await bcrypt.hash(password, 10);

      const createUserQuery = `INSERT INTO 
              user (username,name,age,password)
              VALUES ('${username}','${name}', ${age}, '${hashedPassword}');`;
      await db.run(createUserQuery);

      response.status(200);
      response.send("User registered");
    } else {
      response.status(400);
      response.send("Password too short!");
    }
  }
});
