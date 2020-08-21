const { gql } = require('apollo-server-express');

module.exports = gql`
  type Rally {
    _id: ID!
    name: String!
    date: String!
    createdBy: User!
  }

  type User {
    _id: ID!
    username: String!
    email: String!
    pasasword: String
    createdRallies: [Rally!]
  }

  input UserInput {
    username: String!
    email: String!
    password: String!
  }

  input RallyInput {
    name: String!
    date: String!
  }

  type Query {
    rallies: [Rally!]!
    list: [String]
  }

  type Mutation {
    createEvent(rallyInput: RallyInput): Rally
    createUser(userInput: UserInput): User
  }
`;
