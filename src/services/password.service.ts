import { COLLECTIONS, EXPIRETIME } from "../config/constants";
import { IContextData } from "../interfaces/context-data.interface";
import { findOneElement, updateOneElement } from "../lib/db-operations";
import JWT from "../lib/jwt";
import MailService from "./mail.service";
import bcrypt from 'bcrypt'

import ResolversOperationService from "./resolvers-operation.service";

class PasswordService extends ResolversOperationService {
  constructor(root: object, variables: object, context: IContextData) {
    super(root, variables, context);
  }
  async sendMail() {
    const email = this.getVariables().user?.email || "";
    if (email === undefined || email === "" || email === " ") {
      return {
        status: false,
        message: "email no definido correctamente",
      };
    }
    // agarrar informacion del usuario
    const user = await findOneElement(this.getDb(), COLLECTIONS.USERS, {
      email,
    });

    // comprobar que existe el usuario
    if (user === undefined || user === null) {
      return {
        status: false,
        message: `Usuario con el ${email} no existe `,
      };
    }
    const newUser = {
      id: user.id,
      email,
    };
    const token = new JWT().sign({ user: newUser }, EXPIRETIME.M15);
    const html = `Para resetear la cuenta haz click sobre esto: <a href="${process.env.CLIENT_URL}/#/reset/${token}">Clic aqui</a>`;
    const mail = {
      to: email,
      subject: "Cambiar  contraseña",
      html,
    };
    return new MailService().send(mail);
  }

  async change(){
    const id = this.getVariables().user?.id ;
    let password = this.getVariables().user?.password ;
      // comprobar que el id es correcto
      if (id === undefined || id === "" || id === " ") {
        return {
          status: false,
          message: "EL ID necesita una informacion correcta",
        };
      }

      // comprobar que el password es correcto
      if (password === undefined || password === "" || password === " " || password === "1234") {
        return {
          status: false,
          message: "EL password necesita una informacion correcta",
        };
      }

      // ecriptar el password
      password = bcrypt.hashSync(password, 10);

      // Actualizar password
      const result = await this.update(
          COLLECTIONS.USERS,
          {id},
          {password},
          'usuarios'
      );
      return {
          status: result.status,
          message:(result.status)? 'Password cambiada correctamente' : result.message
      }
  }
}

export default PasswordService;
