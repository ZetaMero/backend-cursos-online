import { Db } from "mongodb";
import { COLLECTIONS } from "../config/constants";
import { IContextData } from "../interfaces/context-data.interface";
import { IVariables } from "../interfaces/variable.interface";
import {
  deleteOneElement,
  findElement,
  findOneElement,
  insertOneElement,
  updateOneElement,
} from "../lib/db-operations";
import { pagination } from "../lib/pagination";

class ResolversOperationService {
  private variable: IVariables;
  private context: IContextData;
  constructor(root: object, variable: IVariables, context: IContextData) {
    this.variable = variable;
    this.context = context;
  }
  protected getContext(): IContextData {
    return this.context;
  }
  protected getDb(): Db {
    return this.context.db!;
  }
  protected getVariables(): IVariables {
    return this.variable;
  }
  //   Listar informacion
  protected async list(
    collection: string,
    listElement: string,
    page: number = 1,
    itemsPage: number = 20
  ) {
    try {
      const paginationData = await pagination(
        this.getDb(),
        collection,
        page,
        itemsPage
      );

      return {
        info: {
          page: paginationData.page,
          pages: paginationData.pages,
          itemsPage: paginationData.itemsPage,
          total: paginationData.total,
        },
        status: true,
        message: `Lista de ${listElement} cargadas`,
        items: await findElement(this.getDb(), collection, {}, paginationData),
      };
    } catch (error) {
      return {
        info: null,
        status: false,
        message: `Lista de secciones no cargadas: ${error}`,
        items: null,
      };
    }
  }
  // Obtener detalles  del item

  protected async get(collection: string) {
    const collectionLabel = collection.toLowerCase();

    try {
      return await findOneElement(this.getDb(), collection, {
        id: this.variable.id,
      }).then((result) => {
        if (result) {
          return {
            status: true,
            message: `${collectionLabel} ha sido cargada correctamente`,
            item: result,
          };
        }
        return {
          status: true,
          message: `${collectionLabel} no ha sido cargada porque no existe`,
          item: null,
        };
      });
    } catch (error) {
      return {
        status: false,
        message: `Error inesperado al querer cargar los detalles de ${collectionLabel}`,
        item: null,
      };
    }
  }
  // Anadir item

  protected async add(collection: string, document: object, item: string) {
    try {
      return await insertOneElement(this.getDb(), collection, document).then(
        (res) => {
          if (res.result.ok === 1) {
            return {
              status: true,
              message: `se ha ingresado correctamente la ${item}`,
              item: document,
            };
          }
          return {
            status: false,
            message: `no se ha insertado la ${item}`,
            item: null,
          };
        }
      );
    } catch (error) {
      return {
        status: false,
        message: `Error inesperado al insertar la ${item} intentalo de nuevo `,
        item: null,
      };
    }
  }

  // Modificar item

  protected async update(
    collection: string,
    filter: object,
    objectUpdate: object,
    item: string
  ) {
    try {
      return await updateOneElement(
        this.getDb(),
        collection,
        filter,
        objectUpdate
      ).then((res) => {
        if (res.result.nModified === 1 && res.result.ok) {
          return {
            status: true,
            message: `Elemento de la${item} actualizado correctamente`,
            item: Object.assign({}, filter, objectUpdate),
          };
        }
        return {
          status: false,
          message: `Elemento de la${item} no se ha actualizado , comprueba los datos o no hay nada que actualizar`,
          item: null,
        };
      });
    } catch (error) {
      return {
        status: false,
        message: `Error inesperado al actualizar la ${item}, Intentalo mas tarde`,
        item: null,
      };
    }
  }

  // eliminar item
  protected async del(collection: string, filter: object, item: string) {
    try {
      return await deleteOneElement(this.getDb(), collection, filter).then(
        (res) => {
          if (res.deletedCount === 1) {
            return {
              status: true,
              message: `Elemento de la ${item} borrado correctamente`,
            };
          }
          return {
            status: true,
            message: `Elemento de la ${item} no se ha borrado, comprueba el id`,
          };
        }
      );
    } catch (error) {
      return {
        status: false,
        message: `Error al borrar la ${item} verifica que este enviando los datos correctamente`,
      };
    }
  }
}

export default ResolversOperationService;
