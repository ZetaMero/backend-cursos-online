import GRM from 'graphql-merge-resolvers';
import resolversCursosQuery from './cursos';
import resolversUserQuery from './user';

const queryResolvers = GRM.merge([

    resolversUserQuery,
    resolversCursosQuery
]);

export default queryResolvers;