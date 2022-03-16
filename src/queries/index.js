import { gql } from "@apollo/client";

export const CHATS = gql`
  query Query {
    chats {
      id
      sender {
        id
        firstName
        lastName
        username
        email
      }
      receiver {
        id
        lastName
        firstName
        username
        email
      }
    }
  }
`;

export const USERS = gql`
  query Query {
    users {
      id
      firstName
      lastName
      username
      email
    }
  }
`;

export const CHAT = gql`
  query Query($chatId: ID) {
    chat(chatId: $chatId) {
      id
      sender {
        id
        firstName
        lastName
        username
        email
      }
      receiver {
        id
        firstName
        lastName
        username
        email
      }
      messages {
        isFromSender
        isFromReceiver
        text
        messageId
      }
    }
  }
`;
