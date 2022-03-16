import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation Mutation($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        firstName
        lastName
        username
        email
      }
    }
  }
`;

export const SIGNUP = gql`
  mutation Mutation($input: SignUpInput!) {
    signUp(input: $input) {
      success
    }
  }
`;

export const CREATE_CHAT = gql`
  mutation Mutation($input: CreateChatInput!) {
    createChat(input: $input) {
      id
    }
  }
`;
