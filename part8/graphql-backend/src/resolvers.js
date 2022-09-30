const { UserInputError, AuthenticationError } = require('apollo-server')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

const JWT_SECRET = 'NEED_HERE_A_SECRET_KEY'

const resolvers = {
  Query: {
    me: async (root, args, { currentUser }) => {
      return currentUser
    },

    bookCount: async () => {
      const books = await Book.find()
      return books.length
    },

    authorCount: async () => {
      const authors = await Author.find()
      return authors.length
    },

    allBooks: async (root, { author, genre }) => {
      let authorFound = undefined

      if (author) {
        authorFound = await Author.findOne({ name: author })
        if (!authorFound) {
          throw new UserInputError('Author not found', {
            invalidArgs: author
          })
        }
      }

      const filter = {
        ...(author && { author: authorFound.id }),
        ...(genre && { genres: { $in: [genre] } })
      }

      const books = await Book.find(filter).populate('author')

      return books
    },

    allAuthors: async () => {
      const authors = await Author.find()

      for (const author of authors) {
        const books = await Book.find({ author: author.id })
        author.bookCount = books.length
      }

      return authors
    }
  },

  Mutation: {
    createUser: async (root, { username, favouriteGenre }) => {
      const user = new User({ username, favouriteGenre })
      return user.save()
    },

    login: async (root, { username, password }) => {
      const user = await User.findOne({ username })

      if (!user || password !== 'secret') {
        throw new UserInputError('wrond credentials')
      }

      const userForToken = {
        username: user.username,
        id: user._id
      }

      return { value: jwt.sign(userForToken, JWT_SECRET) }
    },

    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }

      let author = await Author.findOne({ name: args.author })

      if (!author) {
        author = new Author({ name: args.author })
        await author.save()
      }

      const newBook = new Book({ ...args, author: author.id })
      const savedBook = await newBook.save()
      return savedBook.populate('author')
    },

    editAuthor: async (root, { name, setBornTo }, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }

      const authorFound = await Author.findOne({ name })

      if (authorFound) {
        authorFound.born = setBornTo
        const authorSaved = await authorFound.save()

        const books = await Book.find({ author: authorSaved.id })
        authorSaved.bookCount = books.length

        return authorSaved
      }

      throw new UserInputError('Author not found', {
        invalidArgs: name
      })
    }
  }
}

module.exports = resolvers