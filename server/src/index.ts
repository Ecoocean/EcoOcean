import { ApolloServer,  } from "apollo-server";
import typeDefs from "./schema";
import { resolvers } from './resolvers'

 
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then((response: { url: string }) => {
  console.log(`🚀 Server ready at ${response.url}`);
});
