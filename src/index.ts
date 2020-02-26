import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { createConnection } from "typeorm";
import { buildSchema } from "type-graphql";

import { HelloWorldResolver } from "./resolver/HelloWorldResolver";
import { UserResolver } from "./resolver/UserResolver";

(async () => {
  const app = express();
  await createConnection();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloWorldResolver, UserResolver]
    }),
    context: ({ req, res }) => ({ req, res })
  });

  apolloServer.applyMiddleware({ app, cors: false });
  app.listen(8000, () => {
    console.log("connected");
  });
})();
