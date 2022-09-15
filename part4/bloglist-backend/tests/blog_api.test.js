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

describe("missing properties", () => {
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

  test("missing 'title' property returns status code 400", async () => {
    const newBlog = {
      author: "Arto Hellas",
      url: "www.new.blog",
    };
    await api.post("/api/blogs").send(newBlog).expect(400);
  });

  test("missing 'url' property returns status code 400", async () => {
    const newBlog = {
      title: "New blog",
      author: "Arto Hellas",
    };
    await api.post("/api/blogs").send(newBlog).expect(400);
  });
});

describe("deleting blog posts", () => {
  test("a blog post can be deleted", async () => {
    const { body: blogsAtStart } = await api.get("/api/blogs");
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const { body: blogsAtEnd } = await api.get("/api/blogs");
    expect(blogsAtEnd).toHaveLength(initialBlogs.length - 1);
  });

  test("deleting a non existing blog post (but valid id) fails and returns statuscode 404", async () => {
    await api.delete("/api/blogs/5a422a851b54a676234d17f0").expect(404);
    const { body: blogsAtEnd } = await api.get("/api/blogs");
    expect(blogsAtEnd).toHaveLength(initialBlogs.length);
  });

  test("deleting a blog post with invalid id fails and returns statuscode 400", async () => {
    await api.delete("/api/blogs/0").expect(400);
    const { body: blogsAtEnd } = await api.get("/api/blogs");
    expect(blogsAtEnd).toHaveLength(initialBlogs.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
