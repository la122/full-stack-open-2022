const dummy = () => {
  return 1;
};

const totalLikes = (blogs) => blogs.reduce((sum, item) => sum + item.likes, 0);

module.exports = {
  dummy,
  totalLikes,
};
