import React, { useState,  useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import { submitMessage } from '../../api/chatApi';

function MessageInput({currentChatInfo}) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);


  const initialValues = {
    message: '',
    file: '',
  };

  const messageSchema = Yup.object({
    message: Yup.string().required('Message is required'),
    file: Yup.mixed(),
  });



  const handleSendMessage = (values, { resetForm }) => {
    if (values.message.trim() !== '') {
      const editedvalues = {
        chatId: currentChatInfo.chat_id,
        userId: currentChatInfo.userId,
        securityLevel: currentChatInfo.seclvl,
        chatPassword: currentChatInfo.pass,
        ...values,
      };
      console.log(editedvalues);
      submitMessage(editedvalues);
      resetForm();
    }
  };


  const handleEmojiClick = (emojiData) => {
    setFieldValue('message', messageText + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={messageSchema}
      onSubmit={handleSendMessage}
    >
      {({ setFieldValue }) => (
        <Form>
          <div className="flex items-center justify-between w-full p-3 border-t border-black">
            <button
              type="button"
              className="bg-transparent text-2xl px-2 py-1 mr-1 text-white"
              onClick={() => setShowEmojiPicker((prev) => !prev)}
            >
              <ion-icon name="happy-outline"></ion-icon>
            </button>
            {showEmojiPicker && (
              <EmojiPicker onEmojiClick={handleEmojiClick} autoFocusSearch />
            )}
            <Field type="file" id="file" name="file" className="hidden" />
            <label
              htmlFor="file"
              className="bg-transparent text-2xl px-2 py-1 rounded-md cursor-pointer text-white"
            >
              <ion-icon name="attach-outline"></ion-icon>
            </label>
            <Field
              type="text"
              placeholder="Message"
              className="block w-full py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700"
              name="message"
              onChange={(e) => {
                setFieldValue('message', e.target.value);
              }}
            />
            <button type="submit" className="text-white bg-transparent text-2xl px-2 py-1">
              <ion-icon name="send"></ion-icon>
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default MessageInput;