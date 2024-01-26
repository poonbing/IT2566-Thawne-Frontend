import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import useToken from "./hooks/useToken";

import ChatPage from "./pages/ChatPage";
import NotificationSettings from "./pages/NotificationSettings";
import ProfileSettings from "./pages/ProfileSettings";
import DataSettings from "./pages/DataSettings";
import LoginPage from "./pages/LoginPage";
import NavBar from "./components/NavBar";
import CreateChatModal from "./components/modals/CreateChatModal";

function App() {
  const [selectedChat, setSelectedChat] = useState(null);
  const { token, setToken } = useToken();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="wrapper flex-1">
        <Router>
          <Routes>
            {token ? (
              <>
                <Route
                  path="/"
                  element={
                    <>
                      <NavBar openModal={openModal} />
                      <ChatPage
                        handleChatSelect={handleChatSelect}
                        selectedChat={selectedChat}
                      />
                      {isModalOpen && (
                        <CreateChatModal closeModal={closeModal} />
                      )}
                    </>
                  }
                />
                <Route
                  path="/settings/profile"
                  element={
                    <>
                      <NavBar openModal={openModal} />
                      <ProfileSettings />
                      {isModalOpen && (
                        <CreateChatModal closeModal={closeModal} />
                      )}
                    </>
                  }
                />
                <Route
                  path="/settings/notifications"
                  element={
                    <>
                      <NavBar openModal={openModal} />
                      <NotificationSettings />
                      {isModalOpen && (
                        <CreateChatModal closeModal={closeModal} />
                      )}
                    </>
                  }
                />
                <Route
                  path="/settings/data"
                  element={
                    <>
                      <NavBar openModal={openModal} />
                      <DataSettings />
                      {isModalOpen && (
                        <CreateChatModal closeModal={closeModal} />
                      )}
                    </>
                  }
                />
              </>
            ) : (
              <Route path="/" element={<LoginPage setToken={setToken} />} />
            )}
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
