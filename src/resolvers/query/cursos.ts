import { IResolvers } from "graphql-tools";


const resolversCursosQuery: IResolvers = {
  Query: {
    
    cursos(){
      return true;
    }
  },
};

export default resolversCursosQuery;
