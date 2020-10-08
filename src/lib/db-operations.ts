import { Db } from "mongodb";

/**
 * Obtener el id que vamos a utilizar en el nuevo usuario
 * @param database Base de datos con la que estamos trabajando
 * @param collection coleccion donde queremos buscar el ultimo elemento
 * @param sort como queremos ordenarlo{<propiedad: -1>}
 */
export const asignDocumentId = async (
  database: Db,
  collection: string,
  sort: object = { registerDate: -1 }
) => {
  const lastElement = await database
    .collection(collection)
    .find()
    .limit(1)
    .sort(sort)
    .toArray();
  // se asigna el id al usuario si existe o no
  if (lastElement.length === 0) {
    return 1;
  }
  return lastElement[0].id + 1;
};

export const findOneElement = async (
  database: Db,
  collection: string,
  filter: object
) => {
  return database.collection(collection).findOne(filter);
};

export const insertOneElement = async (
  database: Db,
  collection: string,
  document: object
) => {
  return await database.collection(collection).insertOne(document);
};

export const findElement = async (
  database: Db,
  collection: string,
  filter: object = {}
) => {
  return await database.collection(collection).find(filter).toArray();
};
