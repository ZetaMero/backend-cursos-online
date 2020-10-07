export interface IContext {
  req: Irequest;
  connection: IConnection;
}

interface Irequest {
  headers: {
    authorization: string;
  };
}

interface IConnection {
  authorization: string;
}
