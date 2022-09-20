const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const { userExtractor } = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post("/", userExtractor, async (request, response) => {
  const user = await request.user;

  const blog = new Blog({ ...request.body, user: user._id });
  const savedBlog = await blog.save();

  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", userExtractor, async (request, response) => {
  const user = request.user;
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

blogsRouter.put("/:id", userExtractor, async (request, response) => {
  const user = request.user;
  const { title, author, url, likes } = request.body;

  const blog = await Blog.findById(request.params.id);

  if (blog === null) {
    return response.status(404).end();
  }

  if (blog.user.toString() !== user.id.toString()) {
    return response
      .status(204)
      .json({ error: "cannot update other user's blogs" });
  }

  const blogInfo = {
    title,
    author,
    url,
    likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    blogInfo,
    {
      new: true,
      runValidators: true,
      context: "query",
    }
  );

  response.json(updatedBlog);
});

module.exports = blogsRouter;
