const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const getUser = (token) => {
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!decodedToken.id) {
    throw "token missing or invalid";
  }
  return User.findById(decodedToken.id);
};

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const user = await getUser(request.token);

  const blog = new Blog({ ...request.body, user: user._id });
  const savedBlog = await blog.save();

  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  const user = await getUser(request.token);
  const blog = await Blog.findById(request.params.id);

  if (blog === null) {
    return response.status(404).end();
  }

  if (blog.user.toString() !== user.id.toString()) {
    return response
      .status(204)
      .json({ error: "cannot delete other user's blogs" });
  }

  const result = await blog.delete();

  if (result) {
    return response.status(204).end();
  } else {
    return response.status(404).end();
  }
});

blogsRouter.put("/:id", async (request, response) => {
  const { title, author, url, likes } = request.body;

  const blog = {
    title,
    author,
    url,
    likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
    runValidators: true,
    context: "query",
  });

  response.json(updatedBlog);
});

module.exports = blogsRouter;
