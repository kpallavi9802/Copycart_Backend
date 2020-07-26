const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql').graphqlHTTP;
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');




const app = express();
app.use(bodyParser.json());


const graphQlSchema = require('./apis/schema/graphqlSchema');
const graphQlResolvers = require('./apis/resolver/graphqlResolver');

app.use(
    '/graphql',
    graphqlHttp({
      schema: graphQlSchema,
      rootValue: graphQlResolvers,
      graphiql: true
    })
  )
  


  mongoose.connect("mongodb+srv://Pallavi:1234abcd@cluster-copycart.e8hly.mongodb.net/CopyCart?retryWrites=true&w=majority",{useNewUrlParser: true,useUnifiedTopology: true,})
    .then(() => {
        app.listen(3000);
        console.log("server started")
      })
      .catch(err => {
        console.log(err);
      });

