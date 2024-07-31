import { gql } from 'graphql-request';

export default gql`
  query AllPets {
    allPets(orderBy: NAME_ASC) {
      totalCount
      nodes {
        id
        name
        userId
        dob
        nodeId
      }
    }
  }
`;
