import React, { useState } from "react";
import useToken from "../hooks/useToken";
import useUserPassword from "../hooks/useUserPassword";
import socketIOClient from "socket.io-client";
import ChatList from "../components/ChatList";
import ChatView from "../components/ChatView";
import OpenCVComponent from "../components/OpenCV";
import VerifyChatModal from "../components/modals/VerifyChatModal";

function ChatPage({ handleChatSelect, selectedChat }) {
  const [currentChatInfo, setcurrentChatInfo] = useState({});
  const [chatList, setChatList] = useState([]);
  const [verifyChatModalIndex, setVerifyChatModalIndex] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  const { token } = useToken();

  const openVerifyChatModal = (index) => {
    setVerifyChatModalIndex(index);
  };

  const closeVerifyChatModal = () => {
    setVerifyChatModalIndex(null);
  };

  const handlePasswordSubmit = async (password) => {
    const socket = socketIOClient("http://localhost:5000");
    try {
      const data = await new Promise((resolve, reject) => {
        socket.emit("verify_chat_user", {
          uid: token,
          cid: chatList[verifyChatModalIndex].chat_id,
          seclvl: chatList[verifyChatModalIndex].security_level,
          pass: password,
        });
        socket.on("return_chat_user", (data) => {
          socket.disconnect();
          resolve(data);
        });
        socket.on("error_chat_user", (error) => {
          socket.disconnect();
          reject(error);
        });
      });

      if (data.success) {
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
      } else {
        console.error("Incorrect password");
      }
    } catch (error) {
      console.error("Error processing password submission:", error);
    }
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
          />
          <OpenCVComponent />
        </div>
        <div className="container w-screen relative">
          <ChatView
            selectedChat={selectedChat}
            currentChatInfo={currentChatInfo}
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
