import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";
import useToken from "./hooks/useToken";

import ChatPage from "./pages/ChatPage";
import NotificationSettings from "./pages/NotificationSettings";
import ProfileSettings from "./pages/ProfileSettings";
import DataSettings from "./pages/DataSettings";
import LoginPage from "./pages/LoginPage";
import PDFViewPage from "./pages/PDFViewPage";
import NavBar from "./components/NavBar";
import CreateChatModal from "./components/modals/CreateChatModal";
import useUserPassword from "./hooks/useUserPassword";

function App() {
  const { userPassword, setUserPassword } = useUserPassword();
  const { token, setToken, logout } = useToken();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [videoStream, setVideoStream] = useState(null);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
    logout();
  }, []);

  return (
    <>
      {loading ? (
        <div className="h-screen w-full flex justify-center items-center">
          <ClimbingBoxLoader
            color={"#FFFF00"}
            loading={loading}
            size={20}
            aria-label="Loading Spinner"
            data-testid="loader"
            speedMultiplier={1}
          />
        </div>
      ) : (
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
                          userPassword={userPassword}
                          loading={loading}
                          setLoading={setLoading}
                        />
                        {isModalOpen && (
                          <CreateChatModal
                            closeModal={closeModal}
                            userPassword={userPassword}
                          />
                        )}
                      </>
                    }
                  />
                  <Route
                    path="/pdf"
                    element={
                      <>
                        <PDFViewPage />
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
                          <CreateChatModal
                            closeModal={closeModal}
                            userPassword={userPassword}
                          />
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
                <Route
                  path="/"
                  element={
                    <LoginPage
                      setToken={setToken}
                      setUserPassword={setUserPassword}
                      loading={loading}
                      setLoading={setLoading}
                    />
                  }
                />
              )}
            </Routes>
          </Router>
        </div>
      )}
    </>
  );
}

export default App;
