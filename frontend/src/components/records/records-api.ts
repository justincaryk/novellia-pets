import {
  AllRecordTypesQuery,
  CreateAllergyRecordMutation,
  CreateAllergyRecordMutationVariables,
  CreateRecordMutation,
  CreateRecordMutationVariables,
  CreateVaccineRecordMutation,
  CreateVaccineRecordMutationVariables,
  RecordsByAnimalIdQuery,
} from '@/graphql/generated/graphql';
import CreatePetRecordRequest from '@/graphql/mutations/create-record';
import CreatePetAllergyRecordRequest from '@/graphql/mutations/create-record-allergy';
import CreatePetVaccineRecordRequest from '@/graphql/mutations/create-record-vaccine';
import GetRecordTypesRequest from '@/graphql/queries/all-record-types';
import GetAllPetRecordsRequest from '@/graphql/queries/pet-records';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useGraphQL from '../graphql/useGraphQL';
import { staticQueryConfig } from '../react-query/defaults';

export enum RECORDS_QUERY_KEYS {
  PET_RECORDS = 'pet_records',
  RECORD_TYPES = 'record_types',
}

type AllergyOrVaccineRecordVariables =
  | { type: 'allergy'; recordDetails: CreateAllergyRecordMutationVariables }
  | { type: 'vaccine'; recordDetails: CreateVaccineRecordMutationVariables };

type CreateRecordPayloadVariables = CreateRecordMutationVariables & AllergyOrVaccineRecordVariables;

export function useRecordsApi() {
  const { graphQLClient } = useGraphQL();
  const queryClient = useQueryClient();

  return {
    getRecordsByPetId: useQuery({
      queryKey: [RECORDS_QUERY_KEYS.PET_RECORDS],
      queryFn: async () => graphQLClient.request<RecordsByAnimalIdQuery>(GetAllPetRecordsRequest),
      ...staticQueryConfig,
    }),
    getRecordTypes: useQuery({
      queryKey: [RECORDS_QUERY_KEYS.RECORD_TYPES],
      queryFn: async () => graphQLClient.request<AllRecordTypesQuery>(GetRecordTypesRequest),
      ...staticQueryConfig,
    }),
    addRecordForPet: useMutation({
      mutationFn: (data: CreateRecordPayloadVariables) =>
        graphQLClient.request<CreateRecordMutation>(CreatePetRecordRequest, data),
      onSuccess: (data) => {
        useMutation({
          mutationFn: (data: CreateRecordPayloadVariables) => {
            if (data.type === 'allergy') {
              graphQLClient.request<CreateAllergyRecordMutation>(
                CreatePetAllergyRecordRequest,
                data,
              );
            } else if (data.type === 'vaccine') {
              graphQLClient.request<CreateVaccineRecordMutation>(
                CreatePetVaccineRecordRequest,
                data,
              );
            }
            // TODO: this is probably invalid. investigate further
            return Promise.resolve();
          },
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: [RECORDS_QUERY_KEYS.PET_RECORDS],
            });
          },
        });
      },
    }),
  };
}
