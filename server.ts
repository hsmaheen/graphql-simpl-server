import * as express from "express";
import * as expressGraphQL from "express-graphql";
import { rootSchema } from "./schema";

const app = express();

app.use(
  "/graphQL",
  expressGraphQL({
    graphiql: true,
    schema: rootSchema
  })
);

app.listen(4000, () => {
  console.log("Listening on port 4000");
});
