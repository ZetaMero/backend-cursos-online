import GRM from 'graphql-merge-resolvers';
import resolversCursosQuery from './cursos';
import resolversSeccionQuery from './seccion';
import resolversUserQuery from './user';

const queryResolvers = GRM.merge([

    resolversUserQuery,
    resolversCursosQuery,
    resolversSeccionQuery
]);

export default queryResolvers;