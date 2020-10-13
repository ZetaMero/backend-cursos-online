import { buildSchemaFromTypeDefinitions } from "apollo-server-express";
import { IResolvers } from "graphql-tools";
import { COLLECTIONS, EXPIRETIME, MENSSAGE } from "../../config/constants";
import { transport } from "../../config/mailer";
import { findOneElement, updateOneElement } from "../../lib/db-operations";
import JWT from "../../lib/jwt";
import UsersService from "../../services/users.service";
import bcrypt from "bcrypt";
import MailService from "../../services/mail.service";
import PasswordService from "../../services/password.service";

const resolversMailMutation: IResolvers = {
  Mutation: {
    async sendEmail(_, { mail }) {
      return new MailService().send(mail);
    },
    async activeUserEmail(_, { id, email }) {
      return new UsersService(_, { user: { id, email } }, {}).active();
    },
    async activeUserAction(_, { id, birthday, password }, { token, db }) {
      // verificar el token
      const verify = verifyToken(token, id);
      if (verify?.status === false) {
        return {
          status: false,
          message: verify.message,
        };
      }

      return new UsersService(
        _,
        { id, user: { birthday, password } },
        { token, db }
      ).unblock(true);
    },
    async resetPassword(_, { email }, { db }) {
      return new PasswordService(_, { user: { email } }, { db }).sendMail();
    },

    async changePassword(_, { id, password }, { db, token }) {
      // verificar token
      const verify = verifyToken(token, id);
      if (verify?.status === false) {
        return {
          status: false,
          message: verify.message,
        };
      }
      return new PasswordService(
        _,
        { user: { id, password } },
        { db }
      ).change();
    },
  },
};
function verifyToken(token: string, id: string) {
  const checkToken = new JWT().verify(token);
  if (checkToken === MENSSAGE.TOKEN_VERFICATION_FAILED) {
    return {
      status: false,
      message:
        "El periodo para resetear el usuario a caducado, contacta con el administrador",
    };
  }
  // si el token es vallido , asginar la informacion del usuario
  const user = Object.values(checkToken)[0];
  if (user.id !== id) {
    return {
      status: false,
      message: "El usuario del token no es igual al que estas activando",
    };
  }
}

export default resolversMailMutation;
