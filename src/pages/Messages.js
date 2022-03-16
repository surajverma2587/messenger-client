import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Alert from "@mui/material/Alert";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { useQuery } from "@apollo/client";
import { CHATS } from "../queries";

export const MessagesPage = () => {
  const { data, loading, error } = useQuery(CHATS);

  console.log(data);

  const renderChats = () =>
    data?.chats?.map(() => (
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar
            alt="Travis Howard"
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
          />
        </ListItemAvatar>
        <ListItemText
          primary="Alice Green"
          secondary={
            <>
              <Typography
                sx={{ display: "inline" }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                alicegreen
              </Typography>
            </>
          }
        />
      </ListItem>
    ));

  const renderNoChats = () => (
    <Typography
      variant="h6"
      gutterBottom
      component="div"
      sx={{ textAlign: "center" }}
    >
      You have currently have no active chats.
    </Typography>
  );

  return (
    <Box>
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {data?.chats?.length !== 0 ? renderChats() : renderNoChats()}
      </List>
    </Box>
  );
};
