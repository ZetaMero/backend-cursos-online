import GRM from 'graphql-merge-resolvers';
import resolversSeccionMutation from './seccion';
import resolversUserMutation from './user';

const mutationResolvers = GRM.merge([

    resolversUserMutation,
    resolversSeccionMutation
]);

export default mutationResolvers;