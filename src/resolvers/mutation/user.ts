import { IResolvers } from "graphql-tools";
import { COLLECTIONS } from "../../config/constants";
import bcrypt from "bcrypt";
import {
  asignDocumentId,
  findOneElement,
  insertOneElement,
} from "../../lib/db-operations";

const resolversUserMutation: IResolvers = {
  Mutation: {
    async register(_, { user }, { db }) {
      // Comprobar que el usuario no existe
      const userCheck = await findOneElement(db, COLLECTIONS.USERS, {
        email: user.email,
      });

      if (userCheck !== null) {
        return {
          status: false,
          message: `El email ${user.email} ya existe, no puedes registrarte`,
          user: null,
        };
      }

      // Comprobar el ultimo usuario registrado para asiganar el ID
      user.id = await asignDocumentId(db, COLLECTIONS.USERS, {
        registerDate: -1,
      });
      // Asignar la fecha en formato ISO en la propiedad registreDate
      user.registerDate = new Date().toISOString();
      // encriptar password
      user.password = bcrypt.hashSync(user.password, 10);

      // Guardar el docuemnto (registro en la collection)

      return await insertOneElement(db, COLLECTIONS.USERS, user)
        .then(async () => {
          return {
            status: true,
            message: `El usuario  con el email ${user.email} se registro correctamente`,
            user,
          };
        })
        .catch((err: Error) => {
          console.log(err.message);
          return {
            status: false,
            message: `Error inesperado intenta de nueevo`,
            user: null,
          };
        });
    },
  },
};

export default resolversUserMutation;
