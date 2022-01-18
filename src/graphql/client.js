//we now have the ability to swap out our queries for subscriptions
import ApolloClient from "apollo-client";
//import ApolloClient from 'appollo-boost'
import { WebSocketLink } from "apollo-link-ws";
import { InMemoryCache } from "apollo-cache-inmemory";
import { gql } from "apollo-boost";
import { GET_QUEUED_SONGS } from "./queries";
// import ApolloClient from "apollo-boost";

const client = new ApolloClient({
  link: new WebSocketLink({
    //wss is connecting to web sockets on a secure connection
    uri: "wss://apollo-music-share-brian-kidd.herokuapp.com/v1/graphql",
    options: {
      reconnect: true
    }
  }),
  cache: new InMemoryCache(),
  typeDefs: gql`
    type Song {
      id: uuid!
      title: String!
      artist: String!
      thumbnail: String!
      duration: Float!
      url: String!
    }

    input SongInput {
      id: uuid!
      title: String!
      artist: String!
      thumbnail: String!
      duration: Float!
      url: String!
    }

    type Query {
      queue: [Song]!
    }

    type Mutation {
      addOrRemoveFromQueue(input: SongInput!): [Song]!
    }
  `,
  resolvers: {
    Mutation: {
      //How is the data that we receive on input going to turn into an array of songs 
      addOrRemoveFromQueue: (_, { input }, { cache }) => {
//When you want to update the cache, the first thing you need to do is read from it
//read for the query and then manage that data and then write
        const queryResult = cache.readQuery({
          //we want to read the query of GET_QUEUED_SONGS
          query: GET_QUEUED_SONGS
        });
        //if we have a query result, then we are going to manage that data.
        if (queryResult) {
          const { queue } = queryResult;
          const isInQueue = queue.some(song => song.id === input.id);
          const newQueue = isInQueue
          //if an item isInQueue and the song id is equal to the input song, then remove it
            ? queue.filter(song => song.id !== input.id)
            //otherwise we can add this new song to the end of the queue
            : [...queue, input];
            //write back those changes to the query that was read from
          cache.writeQuery({
            query: GET_QUEUED_SONGS,
            data: { queue: newQueue }
          });
          return newQueue;
        }
        //return an empty array if we cannot read from the query
        return [];
      }
    }
  }
});
// do we have a queue? Well, does local storage have an item with the key of queue
const hasQueue = Boolean(localStorage.getItem("queue"));
//This is where we get all the items that have been saved in local storage
const data = {
  //we converted our array into a string and now we have to parse it back into JSON data in a normal JavaScript array
  //If we don't have a Queue, then return an empty array
  queue: hasQueue ? JSON.parse(localStorage.getItem("queue")) : []
};
// const client = new ApolloClient({
//   uri: "https://apollo-music-share.herokuapp.com/v1/graphql"
// });
client.writeData({ data });

export default client;
