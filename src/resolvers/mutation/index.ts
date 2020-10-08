import GRM from 'graphql-merge-resolvers';
import resolversUserMutation from './user';

const mutationResolvers = GRM.merge([

    resolversUserMutation
]);

export default mutationResolvers;