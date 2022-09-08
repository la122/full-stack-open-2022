const dummy = () => {
  return 1;
};

const totalLikes = (blogs) => blogs.reduce((sum, item) => sum + item.likes, 0);

const favoriteBlog = (blogs) =>
  blogs.reduce((prev, current) =>
    prev.likes > current.likes ? prev : current
  );

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
