import { IPaginationOptions } from "./pagination-options.interface";
import { ISeccion } from "./seccion.interface";
import { IUser } from "./user.interface";

export interface IVariables {
  id?: string | number;
  seccion?: ISeccion;
  user?: IUser;
  pagination?: IPaginationOptions;
}
