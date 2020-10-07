import { IResolvers } from "graphql-tools";
import { COLLECTIONS } from "../config/constants";
import bcrypt from "bcrypt";

const resolversMutation: IResolvers = {
  Mutation: {
    async register(_, { user }, { db }) {
      // Comprobar que el usuario no existe
      const userCheck = await db
        .collection(COLLECTIONS.USERS)
        .findOne({ email: user.email });

      if (userCheck !== null) {
        return {
          status: false,
          message: `El email ${user.email} ya existe, no puedes registrarte`,
          user: null,
        };
      }

      // Comprobar el ultimo usuario registrado para asiganar el ID
      const lastUser = await db
        .collection(COLLECTIONS.USERS)
        .find()
        .limit(1)
        .sort({ registerDate: -1 })
        .toArray();
      // se asigna el id al usuario si existe o no
      if (lastUser.length === 0) {
        user.id = 1;
      } else {
        user.id = lastUser[0].id + 1;
      }
      // Asignar la fecha en formato ISO en la propiedad registreDate
      user.registerDate = new Date().toISOString();
      // encriptar password
      user.password = bcrypt.hashSync(user.password, 10);

      // Guardar el docuemnto (registro en la collection)

      return await db
        .collection(COLLECTIONS.USERS)
        .insertOne(user)
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

export default resolversMutation;
