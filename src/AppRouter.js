import { Route, Routes, Navigate } from "react-router-dom";
import Container from "@mui/material/Container";

import { useAuth } from "./contexts/AppProvider";
import { AppNavBar } from "./components/AppNavBar";
import { LoginPage } from "./pages/LoginPage";
import { SignUpPage } from "./pages/SignUpPage";
import { DashboardPage } from "./pages/DashboardPage";
import { MessagesPage } from "./pages/Messages";
import { HomePage } from "./pages/HomePage";
import { ChatPage } from "./pages/ChatPage";

export const AppRouter = () => {
  const { isLoggedIn } = useAuth();

  return (
    <>
      <AppNavBar />
      <Container component="main" maxWidth="md">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          {isLoggedIn ? (
            <>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/messages/:chatId" element={<ChatPage />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </Container>
    </>
  );
};
