import { gql } from 'graphql-request';

export default gql`
  mutation AddPet($input: CreatePetInput!) {
    createPet(input: $input) {
      pet {
        id
        name
        ownerId
        ownerFirstName
        ownerLastName
        nodeId
      }
    }
  }
`;
