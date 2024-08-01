import {
  AddPetMutation,
  AddPetMutationVariables,
  AllAnimalsQuery,
  AllPetsQuery,
} from '@/graphql/generated/graphql';
import CreatePetRequest from '@/graphql/mutations/create-pet';
import GetAnimalRequest from '@/graphql/queries/all-animals';
import GetAllPetsRequest from '@/graphql/queries/all-pets';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useGraphQL from '../graphql/useGraphQL';
import { staticQueryConfig } from '../react-query/defaults';

export enum PET_QUERY_KEYS {
  PETS = 'pets',
  ANIMALS = 'animals',
}

export function usePetsApi() {
  const { graphQLClient } = useGraphQL();
  const queryClient = useQueryClient();

  return {
    getAnimals: useQuery({
      queryKey: [PET_QUERY_KEYS.ANIMALS],
      queryFn: async () => graphQLClient.request<AllAnimalsQuery>(GetAnimalRequest),
      ...staticQueryConfig,
    }),
    getPets: useQuery({
      queryKey: [PET_QUERY_KEYS.PETS],
      queryFn: async () => graphQLClient.request<AllPetsQuery>(GetAllPetsRequest),
      ...staticQueryConfig,
    }),
    addPet: useMutation({
      mutationFn: (data: AddPetMutationVariables) =>
        graphQLClient.request<AddPetMutation>(CreatePetRequest, data),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [PET_QUERY_KEYS.PETS],
        });
      },
    }),
    // updatePet: useMutation({
    //     mutationFn: (data: UpdateFeatureRefsByIdMutationVariables) =>
    //       graphQLClient.request<UpdateFeatureRefsByIdMutation>(UpdateFeatureRefsByIdRequest, data),
    //     onSuccess: () => {
    //       queryClient.invalidateQueries({
    //         queryKey: [ PET_QUERY_KEYS.FEATURES ],
    //       })
    //     },
    //   }),
  };
}
