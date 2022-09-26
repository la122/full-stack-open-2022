const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const User = require("../models/user");
const { initialBlogs, blogsInDb, initialUser } = require("./test_helper");

let TOKEN = "";

beforeEach(async () => {
  await User.deleteMany({});
  await api
    .post("/api/users")
    .send({ ...initialUser, password: "secret" })
    .expect(201);

  const result = await api
    .post("/api/login")
    .send({ username: initialUser.username, password: "secret" })
    .expect(200);

  TOKEN = result.body.token;
  await Blog.deleteMany({});
  const blogsWithUser = initialBlogs.map((b) => {
    b.user = result.body.userId;
    return b;
  });
  await Blog.insertMany(blogsWithUser);
});

test("returns the correct amount of blog posts in JSON format", async () => {
  const { body } = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);

  expect(body).toHaveLength(initialBlogs.length);
});

test("blog posts have property 'id'", async () => {
  const response = await api.get("/api/blogs");
  expect(response.body[0].id).toBeDefined();
});

describe("creating new blog post", () => {
  test("adding new blog fails with proper statuscode and message if there is no token", async () => {
    const newBlog = {
      title: "New blog",
      author: "Arto Hellas",
      url: "www.new.blog",
      likes: 0,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(401)
      .expect("Content-Type", /application\/json/);

    const blogs = await blogsInDb();

    expect(blogs).toHaveLength(initialBlogs.length);
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
      .set("Authorization", `Bearer ${TOKEN}`)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogs = await blogsInDb();

    expect(blogs).toHaveLength(initialBlogs.length + 1);
    expect(blogs).toEqual(
      expect.arrayContaining([expect.objectContaining(newBlog)])
    );
  });
});

describe("missing properties", () => {
  test("missing 'like' property will default to 0", async () => {
    const newBlog = {
      title: "New blog",
      author: "Arto Hellas",
      url: "www.new.blog",
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${TOKEN}`)
      .send(newBlog);

    const blogs = await blogsInDb();
    const result = blogs.find((it) => it.title === newBlog.title);
    expect(result.likes).toBe(0);
  });

  test("missing 'title' property returns status code 400", async () => {
    const newBlog = {
      author: "Arto Hellas",
      url: "www.new.blog",
    };
    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${TOKEN}`)
      .send(newBlog)
      .expect(400);
  });

  test("missing 'url' property returns status code 400", async () => {
    const newBlog = {
      title: "New blog",
      author: "Arto Hellas",
    };
    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${TOKEN}`)
      .send(newBlog)
      .expect(400);
  });
});

describe("deleting blog posts", () => {
  test("a blog post can be deleted", async () => {
    const blogsAtStart = await blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `Bearer ${TOKEN}`)
      .expect(204);

    const blogsAtEnd = await blogsInDb();
    expect(blogsAtEnd).toHaveLength(initialBlogs.length - 1);
  });

  test("deleting a non existing blog post (but valid id) fails and returns statuscode 404", async () => {
    await api
      .delete("/api/blogs/5a422a851b54a676234d17f0")
      .set("Authorization", `Bearer ${TOKEN}`)
      .expect(404);
    const { body: blogsAtEnd } = await api.get("/api/blogs");
    expect(blogsAtEnd).toHaveLength(initialBlogs.length);
  });

  test("deleting a blog post with invalid id fails and returns statuscode 400", async () => {
    await api
      .delete("/api/blogs/0")
      .set("Authorization", `Bearer ${TOKEN}`)
      .expect(400);
    const { body: blogsAtEnd } = await api.get("/api/blogs");
    expect(blogsAtEnd).toHaveLength(initialBlogs.length);
  });
});

describe("updating blog posts", () => {
  const updateBlogAndTest = async (blogToUpdate) => {
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set("Authorization", `Bearer ${TOKEN}`)
      .send(blogToUpdate);
    const blogsAtEnd = await blogsInDb();
    const updatedBlog = blogsAtEnd.find((it) => it.id === blogToUpdate.id);
    expect(updatedBlog).toEqual(blogToUpdate);
  };

  test("blog title can be updated", async () => {
    const blogsAtStart = await blogsInDb();
    await updateBlogAndTest({ ...blogsAtStart[0], title: "updated" });
  });

  test("blog author can be updated", async () => {
    const blogsAtStart = await blogsInDb();
    await updateBlogAndTest({ ...blogsAtStart[0], author: "updated" });
  });

  test("blog url can be updated", async () => {
    const blogsAtStart = await blogsInDb();
    await updateBlogAndTest({ ...blogsAtStart[0], url: "updated" });
  });

  test("blog likes can be updated", async () => {
    const blogsAtStart = await blogsInDb();
    await updateBlogAndTest({ ...blogsAtStart[0], likes: 9000 });
  });
});

afterAll(() => {
  mongoose.connection.close();
});
