const listHelper = require("../utils/list_helper");
const { listWithOneBlog, initialBlogs } = require("./test_helper");

test("dummy returns one", () => {
  const blogs = [];
  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

describe("total likes", () => {
  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    expect(result).toBe(5);
  });

  test("returns sum of likes of a list of blogs", () => {
    const result = listHelper.totalLikes(initialBlogs);
    expect(result).toBe(36);
  });
});

describe("favorite blog", () => {
  test("when list has only one blog, equals that blog", () => {
    const result = listHelper.favoriteBlog(listWithOneBlog);
    expect(result).toEqual(listWithOneBlog[0]);
  });

  test("returns blog with most likes", () => {
    const result = listHelper.favoriteBlog(initialBlogs);

    expect(result).toEqual({
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0,
    });
  });
});

describe("author with most blogs", () => {
  test("list with only one blog", () => {
    const result = listHelper.mostBlogs(listWithOneBlog);
    const expected = { author: listWithOneBlog[0].author, blogs: 1 };
    expect(result).toEqual(expected);
  });

  test("returns author with most blogs", () => {
    const result = listHelper.mostBlogs(initialBlogs);
    const expected = {
      author: "Robert C. Martin",
      blogs: 3,
    };
    expect(result).toEqual(expected);
  });
});

describe("author with most likes", () => {
  test("list with only one blog", () => {
    const result = listHelper.mostBlogs(listWithOneBlog);
    const expected = { author: listWithOneBlog[0].author, blogs: 1 };
    expect(result).toEqual(expected);
  });

  test("returns author with most likes", () => {
    const result = listHelper.mostLikes(initialBlogs);
    const expected = {
      author: "Edsger W. Dijkstra",
      likes: 17,
    };
    expect(result).toEqual(expected);
  });
});
