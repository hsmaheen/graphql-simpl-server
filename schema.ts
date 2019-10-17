import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList
} from "graphql";
import { get, post } from "request-promise";

const VehicleType = new GraphQLObjectType({
  name: "Vehicle",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    make: { type: GraphQLInt },
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return get(`http://localhost:3000/vehicles/${parentValue.id}/users`, {
          json: true
        });
      }
    }
  })
});

const UserType = new GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    vehicle: {
      type: VehicleType,
      resolve(parentValue, args) {
        return get(`http://localhost:3000/vehicles/${parentValue.id}`, {
          json: true
        });
      }
    }
  }
});

const RootQueryType = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return get(`http://localhost:3000/users/${args.id}`, {
          json: true
        });
      }
    },
    vehicle: {
      type: VehicleType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return get(`http://localhost:3000/vehicles/${args.id}`, {
          json: true
        });
      }
    }
  }
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: UserType,
      args: {
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        vehicleId: { type: GraphQLString }
      },
      resolve(parentValue, { firstName, age, vehicleId }) {
        return post("http://localhost:3000/users", {
          body: {
            firstName,
            age,
            vehicleId
          },
          json: true
        });
      }
    }
  }
});

export const rootSchema = new GraphQLSchema({
  query: RootQueryType,
  mutation: mutation
});
