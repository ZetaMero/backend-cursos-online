import { IResolvers } from "graphql-tools";
import SeccionService from "../../services/seccion.service";

const resolversSeccionQuery: IResolvers = {
  Query: {
    async seccions(_, variables, { db }) {
      
      return new SeccionService(_,{pagination: variables}, { db }).items();
    },
    async seccion(_, { id }, { db }) {
      return new SeccionService(_, { id }, { db }).details();
    },
  },
};
export default resolversSeccionQuery;
