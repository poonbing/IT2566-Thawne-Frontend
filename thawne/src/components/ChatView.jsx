import React, { useState, useEffect } from "react";
import MessageList from "./ChatView/MessageList";
import MessageInput from "./ChatView/MessageInput";
import ChatDetails from "./ChatDetails";
import useToken from "../hooks/useToken";

function ChatView({ selectedChat, currentChatInfo, userPassword }) {
  
  const [isDetailsOpen, setDetailsOpen] = useState(false);
  const { token } = useToken();
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [messagePresent, setMessagePresent] = useState(null);
  

  const checkSecurity = (level) => {
    if (level === "Top Secret") {
      return (
        <span className="ml-2 text-xs bg-red-600 text-white font-semibold p-1 rounded-md">
          Top Secret
        </span>
      );
    } else if (level === "Sensitive") {
      return (
        <span className="ml-2 text-xs bg-yellow-600 text-white font-semibold p-1 rounded-md">
          Sensitive
        </span>
      );
    } else {
      return (
        <span className="ml-2 text-xs bg-green-600 text-white font-semibold p-1 rounded-md">
          Open
        </span>
      );
    }
  };

  return (
    <div className="lg:col-span-2 lg:block">
      {selectedChat ? (
        <div
          className={`w-full h-3/4 ${isDetailsOpen ? "lg:w-2/3" : "lg:w-full"}`}
        >
          <div className="relative flex items-center p-3 border-b border-black bg-zinc-800">
            <img
              className="object-cover w-10 h-10 rounded-full"
              src="/images/default_pfp.png"
              alt="username"
            />
            <span
              onClick={() => setDetailsOpen(!isDetailsOpen)}
              className="block ml-2 font-bold text-white hover:text-gray-400 transition-all ease-in-out duration-300 cursor-pointer"
            >
              {selectedChat.chat_name}
            </span>
            <span className="absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3"></span>
            {checkSecurity(selectedChat.security_level)}
          </div>
          {!isFileUploaded && (
            <MessageList
              currentChatInfo={currentChatInfo}
              messagePresent={messagePresent}
              setMessagePresent={setMessagePresent}
            />
          )}
          <div className="bg-zinc-800">
            <MessageInput
              currentChatInfo={currentChatInfo}
              setIsFileUploaded={setIsFileUploaded}
              userPassword={userPassword}
            />
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">
          Select a chat to start messaging.
        </p>
      )}

      {isDetailsOpen && (
        <ChatDetails
          currentChatInfo={currentChatInfo}
          userPassword={userPassword}
          onClose={() => setDetailsOpen(false)}
        />
      )}
    </div>
  );
}

export default ChatView;
