const {
  ApolloServer,
  gql,
  UserInputError,
  AuthenticationError
} = require('apollo-server')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

const MONGODB_URI = process.env.MONGODB_URI
const JWT_SECRET = 'NEED_HERE_A_SECRET_KEY'

console.log('connecting to', MONGODB_URI)

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = gql`
  type User {
    username: String!
    favouriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Book {
    title: String!
    author: Author!
    published: Int!
    id: ID!
    genres: [String!]!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type Query {
    me: User
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book]
    allAuthors: [Author]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    editAuthor(name: String!, setBornTo: Int!): Author
    createUser(username: String!, favouriteGenre: String!): User
    login(username: String!, password: String!): Token
  }
`

const resolvers = {
  Query: {
    me: async (root, args, { currentUser }) => {
      console.log(currentUser)
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
        console.log('author found', authorFound)
        if (!authorFound) {
          throw new UserInputError('Author not found', {
            invalidArgs: author
          })
        }
      }

      console.log('in genre', genre)

      const filter = {
        ...(author && { author: authorFound.id }),
        ...(genre && { genres: { $in: [genre] } })
      }

      const books = await Book.find(filter)

      console.log('books found', books)

      return books
    },

    allAuthors: async () => await Author.find()
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
        console.log('Adding author', author)
        await author.save()
      }

      const newBook = new Book({ ...args, author: author.id })
      console.log('Adding book', newBook)
      const savedBook = await newBook.save()
      return savedBook.populate('author', { name: 1, born: 1 })
    },

    editAuthor: async (root, { name, setBornTo }) => {
      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }

      const authorFound = await Author.findOne({ name })
      if (authorFound) {
        console.log('Author found', authorFound)
        authorFound.born = setBornTo
        const authorSaved = await authorFound.save()
        return authorSaved
      }
      if (!authorFound) {
        throw new UserInputError('Author not found', {
          invalidArgs: name
        })
      }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null

    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET)
      const currentUser = await User.findById(decodedToken.id)
      console.log('current user', currentUser)
      return { currentUser }
    }
  }
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
