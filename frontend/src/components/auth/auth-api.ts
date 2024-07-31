import { useMutation } from '@tanstack/react-query';
import {
  SigninInput,
  SigninMutation,
  SignupInput,
  SignupMutation,
} from '../../graphql/generated/graphql';
import SigninRequest from '../../graphql/mutations/signin';
import SignupRequest from '../../graphql/mutations/signup';
import useGraphQL from '../graphql/useGraphQL';

export function useAuthApi() {
  const { graphQLClient } = useGraphQL();

  return {
    signIn: useMutation({
      mutationFn: (data: SigninInput) => graphQLClient.request<SigninMutation>(SigninRequest, data),
    }),
    signUp: useMutation({
      mutationFn: (data: SignupInput) => graphQLClient.request<SignupMutation>(SignupRequest, data),
    }),
  };
}
