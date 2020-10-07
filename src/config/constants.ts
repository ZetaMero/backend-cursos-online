import environments from "./environments";

if (process.env.NODE_ENV !== "production") {
  const env = environments;
}

export const SECRET_KEY = process.env.SECRET || "faciiCursosOnline2020";


export enum COLLECTIONS {
  USERS='usuarios'
}

export enum MENSSAGE {

  TOKEN_VERFICATION_FAILED = 'token no valido inicia sesion de nuevo'
}

/**
 * H = horas
 * M = minutos
 * D = dias 
 */

 export enum EXPIRETIME {

  H1 = 60 * 60,
  H24 = 24 * H1,
  M15 = H1 /4,
  M20 = H1 / 3,
  D3 = H24 * 3
 }