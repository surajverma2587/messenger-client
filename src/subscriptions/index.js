import { gql } from "@apollo/client";

export const MESSAGE_POSTED = gql`
  subscription Subscription($chatId: ID!) {
    messagePosted(chatId: $chatId) {
      isFromSender
      isFromReceiver
      text
      messageId
    }
  }
`;
