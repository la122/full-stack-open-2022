const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { usersInDb, initialUser } = require("./test_helper");

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ ...initialUser, passwordHash });
    await user.save();
  });

  test("getting a list of users", async () => {
    const { body } = await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(body).toHaveLength(1);
    expect(body).toEqual(
      expect.arrayContaining([expect.objectContaining(initialUser)])
    );
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });
});

describe("trying to create invalid users", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  const testCreateUser = async ({ user, statuscode, errorMessage }) => {
    const usersAtStart = await usersInDb();

    const result = await api.post("/api/users").send(user).expect(statuscode);
    expect(result.body.error).toContain(errorMessage);

    const usersAtEnd = await usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  };

  test("creation fails with proper statuscode and message if username is missing", async () => {
    const newUser = { name: "Root", password: "sekret" };
    await testCreateUser({
      user: newUser,
      statuscode: 400,
      errorMessage: "username missing",
    });
  });

  test("creation fails with proper statuscode and message if password is missing", async () => {
    const newUser = { username: "root", name: "Root" };
    await testCreateUser({
      user: newUser,
      statuscode: 400,
      errorMessage: "password missing",
    });
  });

  test("creation fails with proper statuscode and message if username is too short", async () => {
    const newUser = { username: "ro", name: "Root", password: "sekret" };
    await testCreateUser({
      user: newUser,
      statuscode: 400,
      errorMessage: "username must be at least 3 characters long",
    });
  });

  test("creation fails with proper statuscode and message if password is too short", async () => {
    const newUser = { username: "root", name: "Root", password: "se" };
    await testCreateUser({
      user: newUser,
      statuscode: 400,
      errorMessage: "password must be at least 3 characters long",
    });
  });

  test("creation fails with proper statuscode and message if username already taken", async () => {
    const newUser = { username: "root", name: "Root", password: "sekret" };
    await api.post("/api/users").send(newUser).expect(201);

    await testCreateUser({
      user: newUser,
      statuscode: 400,
      errorMessage: "username must be unique",
    });
  });
});
