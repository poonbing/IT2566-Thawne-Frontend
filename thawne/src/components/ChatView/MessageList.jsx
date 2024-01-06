import React, { useState } from 'react';
import useToken from '../../hooks/useToken';
import extractFirstKey from '../../helpers/extractFirstKey';

function MessageList({ messages }) {
  const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
  const dateTrack = []
  const todayDate = new Date()
  const [dateStamp, setdateStamp] = useState(todayDate.getDate());
  const { token } = useToken();
  const checkMessageList = (messages) => {
    if (messages.length == 0){
      return <p className='text-white text-center'>Chat does not have any messages yet.</p>
    }
    else{
      return null
    }
  }

  const userMessage = (senderId) => {
    if (senderId === token){
      return true
    }
    else{
      return false
    }
  }

  const getTimeStamp = (date, utcOffset) => {
    const time = new Date(date);
    
    const adjustedTime = new Date(time.getTime() + (utcOffset * 60 * 60 * 1000));
  
    let hour = adjustedTime.getHours() % 12;
    if (hour === 0) {
      hour = 12;
    }
  
    const minute = ("0" + adjustedTime.getMinutes()).slice(-2);
    const amPm = adjustedTime.getHours() >= 12 ? 'pm' : 'am';
    const completeTime = hour + ':' + minute + ' ' + amPm;
  
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
    const fullDate = getDate + '/' + getMonth + '/' + getYear
    let Difference_In_Time = todayTime - getTime;
    let Difference_In_Days = Math.floor(Difference_In_Time / (1000 * 3600 * 24));
    
    if(dateTrack.includes(getDate)){
      return null
    }
    
    if(getDate == dateStamp){
      dateTrack.push(getDate)
      return (
      <div className="flex justify-center mb-2">
        <div className="bg-white text-gray-800 px-4 py-2 rounded-full text-sm italic">
          Today
        </div>
      </div>
      )
    }
    else if (Difference_In_Days == 1) {
      dateTrack.push(getDate)
      return (
        <div className="flex justify-center mb-2">
          <div className="bg-white text-gray-800 px-4 py-2 rounded-full text-sm italic">
            Yesterday
          </div>
        </div>
      )
    }
    else if(Difference_In_Days < 7){
      dateTrack.push(getDate)
      return (
        <div className="flex justify-center mb-2">
          <div className="bg-white text-gray-800 px-4 py-2 rounded-full text-sm italic">
            {weekday[date.getDay()]}
          </div>
        </div>
        )
    }
    else{
      dateTrack.push(getDate)
      return (
        <div className="flex justify-center mb-2">
          <div className="bg-white text-gray-800 px-4 py-2 rounded-full text-sm italic">
            {fullDate}
          </div>
        </div>
        )
    }
  }



  return (
    <div className="relative w-full p-6 overflow-y-auto h-[40rem] " style={{ 
      backgroundImage: `url("/images/chatWallpaper.jpg")`
    }}>
      {checkMessageList(messages)}
      <ul className="space-y-2">
        {[...messages].reverse().map((message, index) => (
          <div>
            {getDateStamp(message.date)}
            <li key={index} className={`flex justify-${userMessage(extractFirstKey(message.sent_from)) ? 'end' : 'start'}`}>          
              <div className={`relative max-w-xl px-4 py-2 text-white ${userMessage(extractFirstKey(message.sent_from)) ? 'rounded bg-teal-800' : 'rounded shadow bg-gray-700'}`}>
                {userMessage(extractFirstKey(message.sent_from)) ? null : <p className='text-xs font-semibold italic'>{Object.values(message.sent_from)}</p>}
                <div className='flex justify-between'>
                  {userMessage(extractFirstKey(message.sent_from)) ? <span className="block">{message.content}</span> : <span className="block">{message.content}</span>}
                  <span className='text-xs mt-2 ml-4'>{getTimeStamp(message.date, 8)}</span>
                </div>
              </div>
            </li>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default MessageList;
