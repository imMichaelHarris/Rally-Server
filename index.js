require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Rally = require('./models/rallyModel');
const User = require('./models/userModel');
const typeDefs = require('./typeDefs');

const rallies = [
  {
    name: 'New Rally ',
    date: 'Thu Aug 20 2020 14:03:28 GMT-0700 (Pacific Daylight Time)',
  },
  {
    name: "A party at John's ",
    date: 'Thu Aug 20 2020 14:04:37 GMT-0700 (Pacific Daylight Time)',
  },
  {
    name: 'Movie Night',
    date: 'Thu Aug 20 2020 14:04:48 GMT-0700 (Pacific Daylight Time)',
  },
];

const resolvers = {
  Query: {
    rallies: () => {
      return Rally.find({}).populate('createdBy');
    },
  },
  Mutation: {
    createUser: async (parent, args) => {
      try {
        const canNotCreate = await User.findOne({
          email: args.userInput.email,
        });
        if (canNotCreate) {
          throw new Error('That user already exists.');
        }
        const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
        const user = new User({
          email: args.userInput.email,
          username: args.userInput.username,
          password: hashedPassword,
        });
        const newUser = await user.save();

        return { ...newUser._doc, _id: newUser.id, password: null };
      } catch (err) {
        console.log('Create user err', err);
        return err;
      }
    },
    createEvent: (parent, args) => {
      const event = new Rally({
        name: args.rallyInput.name,
        date: new Date(args.rallyInput.date),
        createdBy: '5f3f35a4beb7f8620489e2f3',
      });
      let createdEvent;
      return event
        .save()
        .then((res) => {
          createdEvent = res;
          return User.findById('5f3f35a4beb7f8620489e2f3');
        })
        .then((user) => {
          user.createdRallies.push(event);
          return user.save();
        })
        .then((res) => {
          return createdEvent;
        })
        .catch((err) => console.log(err));
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
const app = express();
server.applyMiddleware({ app, path: '/' });

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.gk2kg.mongodb.net/${process.env.MONGODB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(5000, () => {
      console.log(`Server is up and running`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
