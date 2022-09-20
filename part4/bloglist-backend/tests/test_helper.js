const User = require("../models/user");

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

const initialUser = { username: "root", name: "Root" };

module.exports = {
  //   initialNotes,
  //   nonExistingId,
  //   notesInDb,
  initialUser,
  usersInDb,
};
