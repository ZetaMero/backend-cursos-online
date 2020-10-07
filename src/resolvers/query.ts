import { IResolvers } from "graphql-tools";
import { COLLECTIONS, MENSSAGE } from "../config/constants";
import JWT from "../lib/jwt";
import bcrypt from "bcrypt";

const resolversQuery: IResolvers = {
  Query: {
    async users(_, __, { db }) {
      try {
        return {
          status: true,
          message: "Lista de usuario cargada correctamente",
          users: await db.collection(COLLECTIONS.USERS).find().toArray(),
        };
      } catch (error) {
        console.log(error);
        return {
          status: false,
          message:
            "Error al cargar los usuarios comprueba que tienes correctamente tus datos",
          users: [],
        };
      }
    },

    async login(_, { email, password }, { db }) {
      try {
        const user = await db.collection(COLLECTIONS.USERS).findOne({ email });

        if (user === null) {
          return {
            status: false,
            message: "Usuario no existe",
            token: null,
          };
        }

        const passwordCheck = bcrypt.compareSync(password, user.password);
        if (passwordCheck !== null) {
          delete user.password;
          delete user.birthday;
          delete user.registerDate;
        }

        return {
          status: true,
          message: !passwordCheck
            ? " Password incorrecto, Sesion no iniciada"
            : " usuario correctamente cargado",
          token: !passwordCheck ? null : new JWT().sign({ user }),
        };
      } catch (error) {
        console.log(error);
        return {
          status: false,
          message:
            "Error al cargar el usuarios comprueba que tienes correctamente tus datos",
          token: null,
        };
      }
    },
    me(_, __, { token }) {
      console.log(token);
      let info = new JWT().verify(token);
      if (info === MENSSAGE.TOKEN_VERFICATION_FAILED) {
        return {
          status: false,
          message: info,
          user: null,
        };
      }
      return {
        status: true,
        message: "Usuario autenticado correctamente mediante el token",
        user: Object.values(info)[0],
      };
    },
  },
};

export default resolversQuery;
