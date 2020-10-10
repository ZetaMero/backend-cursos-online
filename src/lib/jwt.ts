import { EXPIRETIME, MENSSAGE, SECRET_KEY } from "../config/constants";
import jwt from "jsonwebtoken";
import { IJwt } from "../interfaces/jwt.interface";
class JWT {
  private secretkey = SECRET_KEY as string;

  sign(data: IJwt, expiresIn: number = EXPIRETIME.H24) {
    return jwt.sign(
      { user: data.user },
      this.secretkey,
      { expiresIn } //24 horas de caducidad
    );
  }

  verify(token: string) {
    try {
      return jwt.verify(token, this.secretkey);
    } catch (error) {
      return MENSSAGE.TOKEN_VERFICATION_FAILED;
    }
  }
}

export default JWT;
