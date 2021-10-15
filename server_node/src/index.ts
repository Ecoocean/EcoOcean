import { ApolloServer } from "apollo-server";
import typeDefs from "./schema";

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    getAllPollutionReports: () => "world",
  },
  Mutation: {
    addBeach: () => "blla",
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
