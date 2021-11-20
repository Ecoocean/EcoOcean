import { gql } from "@apollo/client";

export const CREATE_USER = gql`
  mutation createUser($input: CreateUserInput!) {
    createUser(input: $input) {
      user {
        uid
      }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation updateUser(
    $input:  UpdateUserInput!
  ) {
    updateUser(input: $input) {
      user {
        uid
      }
    }
  }
`;

