import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
  query AllAuthors {
    allAuthors {
      name
      born
      bookCount
    }
  }
`

export const ALL_BOOKS = gql`
  query AllBooks {
    allBooks {
      title
      author
      published
      id
      genres
    }
  }
`

export const CREATE_BOOK = gql`
  mutation AddBook(
    $title: String!
    $published: Int!
    $genres: [String!]!
    $author: String!
  ) {
    addBook(
      title: $title
      published: $published
      genres: $genres
      author: $author
    ) {
      title
      author
      published
      id
      genres
    }
  }
`

export const EDIT_AUTHOR = gql`
  mutation EditAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      id
      born
      bookCount
    }
  }
`
