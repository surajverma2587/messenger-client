import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useSubscription } from "@apollo/client";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";

import { CHAT } from "../queries";
import { MESSAGE_POSTED } from "../subscriptions";

export const ChatPage = () => {
  const [messages, setMessages] = useState();
  const { chatId } = useParams();
  const {
    data: chatData,
    loading: chatLoading,
    error: chatError,
  } = useQuery(CHAT, { variables: { chatId } });
  const { data: messagePostedData, loading: messagePostedLoading } =
    useSubscription(MESSAGE_POSTED, {
      variables: { chatId },
    });

  useEffect(() => {
    console.log("messagePostedData", messagePostedData);
    if (!messages) {
      setMessages(chatData?.chat?.messages);
    }

    if (messagePostedData) {
      setMessages([messagePostedData?.messagePosted, ...messages]);
    }
  }, [chatData, messagePostedData]);

  if (chatLoading) {
    return <h1>Loading...</h1>;
  }

  if (chatError) {
    return <h1>ERROR</h1>;
  }

  console.log("messagePostedLoading", messagePostedLoading);

  console.log(messages);

  if (messages && messages.length) {
    return (
      <Box sx={{ mt: 3, backgroundColor: "#fff" }}>
        {messages.map((message) => (
          <li key={message.messageId}>{message.text}</li>
        ))}
      </Box>
    );
  }

  return <Alert severity="info">You have no new messages</Alert>;
};
