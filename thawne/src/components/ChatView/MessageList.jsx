import React, { useState, useEffect } from "react";
import useToken from "../../hooks/useToken";
import extractFirstKey from "../../helpers/extractFirstKey";
import { socket } from "../../socket";
import { Link } from "react-router-dom";

function MessageList({ currentChatInfo }) {
  const [messagesList, setMessagesList] = useState([]);

  const handleChatMessage = (messages) => {
    const messageList = messages ? Object.values(messages) : [];
    console.log("The message list", messageList);
    checkMessageList(messageList);
    setMessagesList(messageList);
  };

  useEffect(() => {
    const chatInfo = {
      chatId: currentChatInfo.chat_id,
      userId: token,
      securityLevel: currentChatInfo.seclvl,
      pass: currentChatInfo.pass,
    };

    socket.emit("get_message_list", chatInfo);

    const handleMessageReturn = (data) => {
      handleChatMessage(data);
    };

    const handleErrorMessage = (error) => {
      setMessagesList([]);
    };

    socket.on("return_message_list", handleMessageReturn);
    socket.on("error_message_list", handleErrorMessage);

    return () => {
      socket.off("return_message_list", handleMessageReturn);
      socket.off("error_message_list", handleErrorMessage);
    };
  }, [currentChatInfo]);

  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dateTrack = [];
  const todayDate = new Date();
  const [dateStamp, setdateStamp] = useState(todayDate.getDate());
  const { token } = useToken();

  const checkMessageList = (message) => {
    if (message.length < 1) {
      console.log(message);
      console.log("no messages");
      return (
        <p className="text-white text-center">
          Chat does not have any messages yet.
        </p>
      );
    } else {
      return null;
    }
  };

  const userMessage = (senderId) => {
    if (senderId === token) {
      return true;
    } else {
      return false;
    }
  };

  const getTimeStamp = (date, utcOffset) => {
    const time = new Date(date);

    const adjustedTime = new Date(time.getTime() + utcOffset * 60 * 60 * 1000);

    let hour = adjustedTime.getHours() % 12;
    if (hour === 0) {
      hour = 12;
    }

    const minute = ("0" + adjustedTime.getMinutes()).slice(-2);
    const amPm = adjustedTime.getHours() >= 12 ? "pm" : "am";
    const completeTime = hour + ":" + minute + " " + amPm;

    return completeTime;
  };

  const getDateStamp = (dateList) => {
    const date = new Date(dateList);
    date.setUTCHours(date.getUTCHours() + 8);
    const getDate = date.getDate();
    const getTime = date.getTime();
    const getMonth = date.getMonth();
    const getYear = date.getFullYear();
    const todayTime = todayDate.getTime();
    const fullDate = getDate + "/" + getMonth + "/" + getYear;
    let Difference_In_Time = todayTime - getTime;
    let Difference_In_Days = Math.floor(
      Difference_In_Time / (1000 * 3600 * 24)
    );

    if (dateTrack.includes(getDate)) {
      return null;
    }

    if (getDate == dateStamp) {
      dateTrack.push(getDate);
      return (
        <div className="flex justify-center mb-2">
          <div className="bg-white text-gray-800 px-4 py-2 rounded-full text-sm italic">
            Today
          </div>
        </div>
      );
    } else if (Difference_In_Days == 1) {
      dateTrack.push(getDate);
      return (
        <div className="flex justify-center mb-2">
          <div className="bg-white text-gray-800 px-4 py-2 rounded-full text-sm italic">
            Yesterday
          </div>
        </div>
      );
    } else if (Difference_In_Days < 7) {
      dateTrack.push(getDate);
      return (
        <div className="flex justify-center mb-2">
          <div className="bg-white text-gray-800 px-4 py-2 rounded-full text-sm italic">
            {weekday[date.getDay()]}
          </div>
        </div>
      );
    } else {
      dateTrack.push(getDate);
      return (
        <div className="flex justify-center mb-2">
          <div className="bg-white text-gray-800 px-4 py-2 rounded-full text-sm italic">
            {fullDate}
          </div>
        </div>
      );
    }
  };

  const checkMessageType = (message) => {
    console.log(message);
    if (typeof message === "string") {
      return message;
    } else {
      if (message.filename.toLowerCase().endsWith(".pdf")) {
        return (
          <Link to={{ pathname: "/pdf" }} state={{ url: message.url }}>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/PDF_file_icon.svg/1200px-PDF_file_icon.svg.png"
              alt={message.filename}
              width={50}
              height={50}
            />
            {message.filename}
          </Link>
        );
      }
      return <img src={message.url} alt={message.url} />;
    }
  };

  return (
    <div
      className="relative w-full p-6 overflow-y-auto h-[40rem] "
      style={{
        backgroundImage: `url("/images/chatWallpaper.jpg")`,
      }}
    >
      {messagesList.length > 0 && (
        <>
          <ul className="space-y-2">
            {messagesList.map((message, index) => (
              <div>
                {getDateStamp(message.date)}
                <li
                  key={index}
                  className={`flex justify-${
                    userMessage(extractFirstKey(message.sent_from))
                      ? "end"
                      : "start"
                  }`}
                >
                  <div
                    className={`relative max-w-xl px-4 py-2 text-white ${
                      userMessage(extractFirstKey(message.sent_from))
                        ? "rounded bg-teal-800"
                        : "rounded shadow bg-gray-700"
                    }`}
                  >
                    {userMessage(extractFirstKey(message.sent_from)) ? null : (
                      <p className="text-xs font-semibold italic">
                        {Object.values(message.sent_from)}
                      </p>
                    )}
                    <div className="flex justify-between">
                      {userMessage(extractFirstKey(message.sent_from)) ? (
                        <span className="block">
                          {checkMessageType(message.content)}
                        </span>
                      ) : (
                        <span className="block">
                          {checkMessageType(message.content)}
                        </span>
                      )}
                      <span className="text-xs mt-2 ml-4">
                        {getTimeStamp(message.date, 8)}
                      </span>
                    </div>
                  </div>
                </li>
              </div>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default MessageList;
