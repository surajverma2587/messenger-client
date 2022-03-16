import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import Stack from "@mui/material/Stack";
import ListItem from "@mui/material/ListItem";
import Button from "@mui/material/Button";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

import { USERS } from "../queries";
import { CREATE_CHAT } from "../mutations";
import { useAuth } from "../contexts/AppProvider";

export const DashboardPage = () => {
  const { data, loading, error } = useQuery(USERS);
  const [
    executeCreateChat,
    { loading: createChatLoading, error: createChatError },
  ] = useMutation(CREATE_CHAT);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStartChat = async (event) => {
    const { data } = await executeCreateChat({
      variables: {
        input: {
          sender: user.id,
          receiver: event.target.id,
        },
      },
    });

    if (data?.createChat) {
      navigate(`/messages/${data?.createChat?.id}`, { replace: true });
    }
  };

  if (error) {
    return <h2>Error</h2>;
  }

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <Stack
      sx={{ mt: 3 }}
      direction="row"
      spacing={3}
      alignContent="center"
      justifyContent="center"
      flexWrap="wrap"
    >
      {data?.users?.map((user) => (
        <ListItem
          alignItems="flex-start"
          sx={{ maxWidth: "360px", bgcolor: "background.paper" }}
          key={user.id}
        >
          <ListItemAvatar>
            <Avatar
              alt={`${user.firstName} ${user.lastName}`.toUpperCase()}
              src="/static/images/avatar/1.jpg"
            />
          </ListItemAvatar>
          <ListItemText
            primary={`${user.firstName} ${user.lastName}`.toUpperCase()}
            secondary={
              <Stack spacing={2} component="span">
                <Typography
                  sx={{ display: "inline" }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  {user.username}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={handleStartChat}
                  id={user.id}
                >
                  Message
                </Button>
              </Stack>
            }
          />
        </ListItem>
      ))}
    </Stack>
  );
};
