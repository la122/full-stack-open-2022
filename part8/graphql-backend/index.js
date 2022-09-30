const { ApolloServer, gql } = require('apollo-server')
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

    // TODO
    allBooks: async (root, { author, genre }) => {
      // books.filter(
      //   (book) =>
      //     (author ? book.author === author : true) &&
      //     (genre ? book.genres.includes(genre) : true)
      // ),

      return await Book.find({})
    },

    allAuthors: async () => await Author.find()
  },

  Mutation: {
    addBook: async (root, args) => {
      // let author = await Author.find({ name: args.author })
      // if (!author) {
      //   author = new Author(args.author)
      //   author.save()
      // }

      const newBook = new Book({ ...args, author: null })
      console.log('Adding book', newBook)

      // author.books = author.books.concat(newBook)

      return newBook.save()
    },

    // TODO
    editAuthor: (root, { name, setBornTo }) => {
      const authorFound = authors.find((a) => a.name === name)
      if (authorFound) {
        authorFound.born = setBornTo
        return {
          ...authorFound,
          bookCount: books.filter((book) => name === book.author).length
        }
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
