import { IResolvers } from "graphql-tools";
import { COLLECTIONS } from "../../config/constants";
import { findOneElement } from "../../lib/db-operations";
import SeccionService from "../../services/seccion.service";

const resolversSeccionQuery: IResolvers = {
  Query: {
    async seccions(_, __, { db }) {
      return new SeccionService(_, __, { db }).items();
    },
    async seccion(_, { id }, { db }) {
      return new SeccionService(_, { id }, { db }).details();
    },
  },
};
export default resolversSeccionQuery;
