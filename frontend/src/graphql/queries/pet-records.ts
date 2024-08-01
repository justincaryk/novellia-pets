import { gql } from 'graphql-request';

export default gql`
  query RecordsByAnimalId($petId: UUID!) {
    petById(id: $petId) {
      recordsByPetId {
        nodes {
          id
          recordType
          createdAt
          allergyRecordsByRecordId {
            nodes {
              id
              name
              reactions
              severity
            }
          }
          vaccineRecordsByRecordId {
            nodes {
              id
              administeredAt
            }
          }
        }
      }
    }
  }
`;
