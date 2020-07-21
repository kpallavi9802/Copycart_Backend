const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql').graphqlHTTP;
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');




const app = express();
app.use(bodyParser.json());


const graphQlSchema = require('./apis/schema/schemas');
const graphQlResolvers = require('./apis/resolver/resolvers');

app.use(
    '/graphql',
    graphqlHttp({
      schema: graphQlSchema,
      rootValue: graphQlResolvers,
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

