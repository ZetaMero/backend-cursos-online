import { filter } from "compression";
import { COLLECTIONS } from "../config/constants";
import { IContextData } from "../interfaces/context-data.interface";
import { asignDocumentId, findOneElement } from "../lib/db-operations";
import ResolversOperationService from "./resolvers-operation.service";

class SeccionService extends ResolversOperationService {
  collection = COLLECTIONS.SECCION;
  constructor(root: object, variable: object, context: IContextData) {
    super(root, variable, context);
  }

  async items() {
    const result = await this.list(this.collection, "seccion");
    return {
      status: result.status,
      message: result.message,
      seccions: result.items,
    };
  }
  async details() {
    const result = await this.get(this.collection);
    return {
      status: result.status,
      message: result.message,
      seccion: result.item,
    };
  }
  async insert() {
    const seccion = this.getVariables().seccion;

    // comporbar que no esta en blanco ni es indefinido
    if (!this.checkData(seccion?.name || " ")) {
      return {
        status: false,
        message: "la seccion no se ha especificado correctamente",
        seccion: null,
      };
    }

    // comprobar que no existe
    if (await this.checkInDataBase(seccion?.name || " ")) {
      return {
        status: false,
        message: "la seccion ya existe intenta con otro nombre",
        seccion: null,
      };
    }

    // si valida las opciones anteriores venir y crear el doc
    const seccionObject = {
      id: await asignDocumentId(this.getDb(), this.collection, { id: -1 }),
      name: seccion?.name,
      description: seccion?.description,
      recursos: seccion?.recursos,
    };
    console.log(this.collection);
    const result = await this.add(this.collection, seccionObject, "seccion");
    return {
      status: result.status,
      message: result.message,
      seccion: result.item,
    };
  }
  async modify() {
    const id = this.getVariables().id;
    const seccion = this.getVariables().seccion;
    // comprobar que el id es correcto
    if (!this.checkData(String(id) || "")) {
      return {
        status: false,
        message: "El ID de la seccion no se ha especificado correctamente",
        seccion: null,
      };
    }
    // comprobar que el genero es  correcto
    if (!this.checkData(seccion?.name || " ")) {
      return {
        status: false,
        message: "la seccion no se ha especificado correctamente",
        seccion: null,
      };
    }

    const objectUpdate = {
      name: seccion?.name,
      description: seccion?.description,
      recursos: seccion?.recursos,
    };
    console.log(objectUpdate);
    const result = await this.update(
      this.collection,
      { id },
      objectUpdate,
      "seccion"
    );
    return {
      status: result.status,
      message: result.message,
      seccion: result.item,
    };
  }

  async delete() {
    const id = this.getVariables().id;

    if (!this.checkData(String(id) || "")) {
      return {
        status: false,
        message: "El ID de la seccion no se ha especificado correctamente",
        seccion: null,
      };
    }
    const result = await this.del(this.collection, { id }, "seccion");
    return {
      status: result.status,
      message: result.message,
    };
  }
  private checkData(value: string) {
    return value === " " || value === undefined ? false : true;
  }

  private async checkInDataBase(value: string) {
    return await findOneElement(this.getDb(), this.collection, {
      name: value,
    });
  }
}

export default SeccionService;
