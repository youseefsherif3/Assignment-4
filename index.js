// ============================================== Part1:Simple CRUD Operations Using Express.js: ==============================================
const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;
const usersPath = path.resolve("./users.json");

// read users from users.json file
function readUsers() {
  const data = fs.readFileSync(usersPath);
  return JSON.parse(data);
}

// write users to users.json file
function writeUsers(users) {
  fs.writeFileSync(usersPath, JSON.stringify(users), "utf-8");
}

// Middleware to parse JSON bodies
app.use(express.json());

// 1. Create an API that adds a new user to your users stored in a JSON file. (ensure that the email of the new user doesn’t exist before)

app.post("/users", (req, res, next) => {
  const { name, email, age } = req.body;
  const users = readUsers();

  // check if email already exists
  const emailExists = users.find((user) => {
    return user.email === email;
  });

  if (emailExists) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const newUser = {
    id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
    name,
    email,
    age,
  };

  users.push(newUser);
  writeUsers(users);
  return res
    .status(201)
    .json({ message: "User added successfully", user: newUser });
});

// 2. Create an API that updates an existing user's name, age, or email by their ID. The user ID should be retrieved from the params.

app.patch("/users/:id", (req, res, next) => {
  const id = req.params.id;
  const users = readUsers();

  const userIndex = users.findIndex((user) => {
    return user.id == id;
  });

  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  const { name, email, age } = req.body;

  if (name) users[userIndex].name = name;

  if (email) users[userIndex].email = email;

  if (age) users[userIndex].age = age;

  writeUsers(users);
  return res
    .status(200)
    .json({ message: "User updated successfully", user: users[userIndex] });
});

// 3. Create an API that deletes a User by ID. The user id should be retrieved from either the request body or optional params.

app.delete("/users/:id", (req, res, next) => {
  const users = readUsers();
  const id = req.params.id;

  const userIndex = users.findIndex((user) => {
    return user.id == id;
  });

  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  const deletedUser = users.splice(userIndex, 1);

  writeUsers(users);
  return res
    .status(200)
    .json({ message: "User deleted successfully", deletedUser: deletedUser });
});

// 4. Create an API that gets a user by their name. The name will be provided as a query parameter.

app.get("/users", (req, res, next) => {
  const name = req.query.name;
  const users = readUsers();

  const checkUser = users.find((user) => {
    return user.name == name;
  });

  if (!checkUser) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json({ user: checkUser });
});

// 5. Create an API that gets all users from the JSON file.

app.get("/allUsers", (req, res, next) => {
  const users = readUsers();
  return res.status(200).json({ users });
});

// 6. Create an API that filters users by minimum age.

app.get("/filterUsers", (req, res, next) => {
  const minAge = req.query.minAge;
  const users = readUsers();

  const filteredUsers = users.filter((user) => {
    return user.age >= minAge;
  });

  if (filteredUsers.length === 0) {
    return res.status(404).json({ message: "No users found with the specified minimum age" });
  }

  return res.status(200).json({ users: filteredUsers });
});

// 7. Create an API that gets User by ID.

app.get("/users/:id", (req, res, next) => {
    const id = req.params.id;
    const users = readUsers();

    const user = users.find((user) => {
      return user.id == id;
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
});

// handle errors
app.use((req, res, next) => {
  return res.status(404).json({ message: "Not Found" });
});

// start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

