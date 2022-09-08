const { flow, countBy, entries, maxBy, last, zipObject } = require("lodash/fp");

const dummy = () => {
  return 1;
};

const totalLikes = (blogs) => blogs.reduce((sum, item) => sum + item.likes, 0);

const favoriteBlog = (blogs) =>
  blogs.reduce((prev, current) =>
    prev.likes > current.likes ? prev : current
  );

const mostBlogs = (blogs) =>
  flow(
    countBy("author"),
    entries,
    maxBy(last),
    zipObject(["author", "blogs"])
  )(blogs);

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};
