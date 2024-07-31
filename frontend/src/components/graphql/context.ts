'use client';

import { GraphQLClient } from 'graphql-request';
import { createContext } from 'react';

export const GraphQLClientContext = createContext<{
  graphQLClient: GraphQLClient;
}>({
  graphQLClient: new GraphQLClient(
    process.env.NEXT_PUBLIC_GRAPHQL_HOST || 'http://localhost:3000/api/graphql',
  ),
});

export default GraphQLClientContext;
