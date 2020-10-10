import { IResolvers } from "graphql-tools";
import SeccionService from "../../services/seccion.service";

const resolversSeccionMutation: IResolvers = {
  Mutation: {
    addSeccion(_, variables, context) {
      // anadimos la llamada al servidio
      return new SeccionService(_, variables, context).insert();
    },
    updateSeccion(_, variables, context) {
      // modificamos la llamada al servidio
      return new SeccionService(_, variables, context).modify();
    },
    deleteSeccion(_, variables, context) {
      // eliminamos la llamada al servidio
      return new SeccionService(_, variables, context).delete();
    },
  },
};

export default resolversSeccionMutation;
