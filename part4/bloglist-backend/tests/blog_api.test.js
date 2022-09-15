const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const { blogs: initialBlogs } = require("./sample_data");

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(initialBlogs);
});

test("returns the correct amount of blog posts in JSON format", async () => {
  const response = await api.get("/api/blogs");
  expect(response.body).toHaveLength(initialBlogs.length);
});

test("blog posts has property 'id'", async () => {
  const response = await api.get("/api/blogs");
  expect(response.body[0].id).toBeDefined();
});

test("a new blog post can be created", async () => {
  const newBlog = {
    title: "New blog",
    author: "Arto Hellas",
    url: "www.new.blog",
    likes: 0,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");
  expect(response.body).toHaveLength(initialBlogs.length + 1);

  expect(response.body).toEqual(
    expect.arrayContaining([expect.objectContaining(newBlog)])
  );
});

test("missing 'like' property will default to 0", async () => {
  const newBlog = {
    title: "New blog",
    author: "Arto Hellas",
    url: "www.new.blog",
  };

  await api.post("/api/blogs").send(newBlog);

  const response = await api.get("/api/blogs");
  const result = response.body.find((it) => it.title === newBlog.title);
  expect(result.likes).toBe(0);
});

afterAll(() => {
  mongoose.connection.close();
});
