const { ApolloServer, gql, UserInputError } = require('apollo-server')
const { v1: uuid } = require('uuid')
const mongoose = require('mongoose')
require('dotenv').config()

const Author = require('./models/author')
const Book = require('./models/book')

const MONGODB_URI = process.env.MONGODB_URI

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
  }
`

const resolvers = {
  Query: {
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
    addBook: async (root, args) => {
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
  resolvers
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
