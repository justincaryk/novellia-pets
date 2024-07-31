import {
  AddPetMutation,
  AddPetMutationVariables,
  AllAnimalsQuery,
} from '@/graphql/generated/graphql';

import GetAnimalRequest from '@/graphql/queries/all-animals';
import CreatePetRequest from '@/graphql/mutations/create-pet';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useGraphQL from '../graphql/useGraphQL';
import { staticQueryConfig } from '../react-query/defaults';

export enum FEATURES_QUERY_KEYS {
  PETS = 'pets',
  ANIMALS = 'animals',
}

export function usePetsApi() {
  const { graphQLClient } = useGraphQL();
  const queryClient = useQueryClient();

  return {
    getAnimals: useQuery({
      queryKey: [FEATURES_QUERY_KEYS.ANIMALS],
      queryFn: async () => graphQLClient.request<AllAnimalsQuery>(GetAnimalRequest),
      ...staticQueryConfig,
    }),
    // getPets: useQuery({
    //   queryKey: [ FEATURES_QUERY_KEYS.FEATURES_DATA ],
    //   queryFn: async () => graphQLClient.request<FeatureRelationDataQuery>(GetFeaturesRelationDataRequest),
    //   ...staticQueryConfig,
    // }),
    addPet: useMutation({
      mutationFn: (data: AddPetMutationVariables) =>
        graphQLClient.request<AddPetMutation>(CreatePetRequest, data),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [FEATURES_QUERY_KEYS.PETS],
        });
      },
    }),
    // updatePet: useMutation({
    //     mutationFn: (data: UpdateFeatureRefsByIdMutationVariables) =>
    //       graphQLClient.request<UpdateFeatureRefsByIdMutation>(UpdateFeatureRefsByIdRequest, data),
    //     onSuccess: () => {
    //       queryClient.invalidateQueries({
    //         queryKey: [ FEATURES_QUERY_KEYS.FEATURES ],
    //       })
    //     },
    //   }),
  };
}
