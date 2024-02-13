import React, { useState } from "react";
import useToken from "../hooks/useToken";
import useUserPassword from "../hooks/useUserPassword";
import socketIOClient from "socket.io-client";
import ChatList from "../components/ChatList";
import ChatView from "../components/ChatView";
import VerifyChatModal from "../components/modals/VerifyChatModal";
import RotateLoader from "react-spinners/RotateLoader";
import { logEvent } from "../api/logApi";

function ChatPage({
  handleChatSelect,
  selectedChat,
  userPassword,
  loading,
  setLoading,
}) {
  const [currentChatInfo, setcurrentChatInfo] = useState({});
  const [chatList, setChatList] = useState([]);
  const [verifyChatModalIndex, setVerifyChatModalIndex] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  const { token } = useToken();
  const [unlock, setUnlock] = useState(false);

  const openVerifyChatModal = (index) => {
    setVerifyChatModalIndex(index);
  };

  const closeVerifyChatModal = () => {
    setVerifyChatModalIndex(null);
  };

  const handlePasswordSubmit = async (password) => {
    
      return new Promise((resolve, reject) => {
        const socket = socketIOClient("https://thawne-backend-7skvo7hmpa-uc.a.run.app/auth");
        socket.emit("verify_chat_user", {
          uid: token,
          cid: chatList[verifyChatModalIndex].chat_id,
          seclvl: chatList[verifyChatModalIndex].security_level,
          pass: password,
        });
        socket.on("return_chat_user", (data) => {
          socket.disconnect();
          console.log(data)
          setUnlock(true)
          closeVerifyChatModal();
          const selectedChat = chatList[verifyChatModalIndex];
          handleChatSelect(selectedChat);
          setActiveChat(verifyChatModalIndex);
          setcurrentChatInfo({
            chat_id: chatList[verifyChatModalIndex].chat_id,
            userId: token,
            seclvl: chatList[verifyChatModalIndex].security_level,
            pass: password,
          });
          window.FlashMessage.success('Chat user authenticated.')
          resolve(data);
        });
        socket.on("error_chat_user", (error) => {
          socket.disconnect();
          console.log(error)
          const logInfo = {
            userId: token,
            password: userPassword.password,
            type: "Chat login",
            location: chatList[verifyChatModalIndex].security_level + ' Channel',
            context: 'Failed login attempt'
          }
          logEvent(logInfo)
          reject(error);
        });
      });
  };

  return (
    <>
      <div className="flex bg-zinc-800 h-full border-black">
        <div className="basis-2/6 overflow-auto">
          <ChatList
            handleChatSelect={handleChatSelect}
            openVerifyChatModal={openVerifyChatModal}
            setActiveChat={setActiveChat}
            activeChat={activeChat}
            chatList={chatList}
            setChatList={setChatList}
            setcurrentChatInfo={setcurrentChatInfo}
            userPassword={userPassword}
            loading={loading}
            setLoading={setLoading}
            unlock={unlock}
          />
        </div>
        <div className="container w-screen relative">
          <ChatView
            selectedChat={selectedChat}
            currentChatInfo={currentChatInfo}
            userPassword={userPassword}
          />
        </div>
      </div>

      {verifyChatModalIndex !== null && (
        <VerifyChatModal
          handlePasswordSubmit={handlePasswordSubmit}
          closeVerifyChatModal={closeVerifyChatModal}
        />
      )}
    </>
  );
}

export default ChatPage;
