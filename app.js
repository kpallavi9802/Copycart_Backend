const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql').graphqlHTTP;
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const Event = require('./models/event');
const User = require('./models/UserSchema');
const Product = require('./models/ProductSchema');

const app = express();
app.use(bodyParser.json());



app.use(
    '/graphql',
    graphqlHttp({
      schema: buildSchema(`
          type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
          }


          input Name{ 
            firstname:String,
            middlename:String,
            lastname:String
          },

          input Address{
            area:String,
            state:String,
            country:String,
            code:Int,
          },
          type Address1{
            area:String,
            state:String,
            country:String,
            code:Int,
          },

          type Addressone{
            area:String,
            state:String,
            country:String,
            code:Int,
          },
          type Nameone{ 
            firstname:String,
            middlename:String,
            lastname:String
          },


          type User {
            _id: ID!
            email: String,
            name:Nameone,
            address:Addressone,
            usertype:String,
          },

          input UserInput {
            email: String!,
            password: String!,
            name: Name!,
            address:Address!,
            usertype: String!,
          },


          input ProductInput{
            producttype:String!,
            brand:String!,
            color:String!,
            size:String!
            description:String!
          }

          type ProductOne{
            producttype:String!,
            brand:String!,
            color:String!,
            size:String!
            description:String!
          }





          input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
          },


          type RootQuery {
              events: [Event!]!
          },
          type RootMutation {
              createEvent(eventInput: EventInput): Event
              createUser(userInput: UserInput): User
              createProduct(productInput:ProductInput):ProductOne
          },


          schema {
              query: RootQuery
              mutation: RootMutation
          }
      `),
      rootValue: {
        events: () => {
          return Event.find()
            .then(events => {
              return events.map(event => {
                return { ...event._doc, _id: event.id };
              });
            })
            .catch(err => {
              throw err;
            });
        },
        createEvent: args => {
          const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date)
          });
          return event
            .save()
            .then(result => {
              console.log(result);
              return { ...result._doc, _id: result._doc._id.toString() };
            })
            .catch(err => {
              console.log(err);
              throw err;
            });
        },


        createProduct: args => {
          const event = new Product({
            producttype:args.productInput.producttype,
            brand:args.productInput.brand,
            color:args.productInput.color,
            size:args.productInput.size,
            description:args.productInput.description
          });
          return event
            .save()
            .then(result => {
              console.log(result);
              return { ...result._doc, _id: result._doc._id.toString() };
            })
            .catch(err => {
              console.log(err);
              throw err;
            });
        },


        createUser: args => {
          return User.findOne({ email: args.userInput.email })
            .then(user => {
              if (user) {
                throw new Error('User exists already.');
              }
              return bcrypt.hash(args.userInput.password, 12);
            })
            .then(hashedPassword => {
              const user = new User({
                email: args.userInput.email,
                password: hashedPassword,
                name: args.userInput.name,
                address: args.userInput.address,
                usertype:args.userInput.usertype
              });
              return user.save();
            })
            .then(result => {
              return { ...result._doc, password: null, _id: result.id };
            })
            .catch(err => {
              throw err;
            });
        }
      },
      graphiql: true
    })
  )
  


  mongoose.connect("mongodb+srv://Biplaba:bips1996@copycart.vkz7v.mongodb.net/TESTDB?retryWrites=true&w=majority",{useNewUrlParser: true,useUnifiedTopology: true,})
    .then(() => {
        app.listen(3000);
      })
      .catch(err => {
        console.log(err);
      });

