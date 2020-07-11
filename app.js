const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql').graphqlHTTP;
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const User = require('./models/UserSchema');
const Product = require('./models/ProductSchema');
const Order=require('./models/OrderSchema');

const app = express();
app.use(bodyParser.json());



app.use(
    '/graphql',
    graphqlHttp({
      schema: buildSchema(`
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
            _id:ID!
            email: String,
            password:String,
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
            _id:ID!,
            producttype:String,
            brand:String,
            color:String,
            size:String
            description:String
          }

          input OrderInput {
            user_id:String!,
            product_id:String!,
            status:String!,
            order_at:String!
          }

          type OrderDetails{
            _id:ID!
            user_id:String!,
            product_id:String!,
            status:String!,
            order_at:String,

          }

          type Queries {
              productall:[ProductOne!]!
              orderall:[OrderDetails!]!
              productbyID(id:ID!):[ProductOne!]!
              orderbyID(id:ID!):[OrderDetails!]
          },
          type Mutations {
              createUser(userInput: UserInput): User
              createProduct(productInput:ProductInput):ProductOne
              createOrder(orderInput:OrderInput):OrderDetails
          },


          schema {
              query: Queries
              mutation: Mutations
              
          }
      `),
      rootValue: {
        
        createOrder: args => {
          const event = new Order({
            user_id:args.orderInput.user_id,
            product_id:args.orderInput.product_id,
            status:args.orderInput.status,
            orderAt:new Date(args.orderInput.order_at)
          });
          return event
            .save()
            .then(result => {
              console.log(result);
              return { ...result._doc, _id: result._doc._id.toString(),order_at:result._doc.orderAt.toString() };
            })
            .catch(err => {
              console.log(err);
              throw err;
            });
        },

        orderall: () => {
          return Order.find()
            .then(events => {
              return events.map(event => {
                return { ...event._doc, _id: event.id,order_at:event.orderAt.toString()};
              });
            })
            .catch(err => {
              throw err;
            });
        },
        orderbyID: ({id}) => {
          return Order.find({"_id":id})
            .then(events => {
              return events.map(event => {
                return { ...event._doc, _id: event.id,order_at:event.orderAt.toString()};
              });
            })
            .catch(err => {
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

        productall: () => {
          return Product.find()
            .then(events => {
              return events.map(event => {
                return { ...event._doc, _id: event.id };
              });
            })
            .catch(err => {
              throw err;
            });
        },
        productbyID: ({id}) => {
          return Product.find({"_id":id})
            .then(events => {
              return events.map(event => {
                return { ...event._doc, _id: event.id };
              });
            })
            .catch(err => {
              throw err;
            });
        },



        // userall: () => {
        //   return User.find()
        //     .then(events => {
        //       return events.map(event => {
        //         return { ...event._doc, password: event.password, _id: event.id };
        //       });
        //     })
        //     .catch(err => {
        //       throw err;
        //     });
        // },


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

