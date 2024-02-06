import React, { useState, useEffect, useRef } from "react";
import EmojiPicker from "emoji-picker-react";
import * as Yup from "yup";
import { Formik, Form, Field, useFormik } from "formik";
import { submitMessage } from "../../api/chatApi";
import { fileUpload } from "../../api/chatApi";
import { PreviewImage } from "./PreviewImage";
import Tooltip from '@mui/material/Tooltip';
import axios from "axios";

function MessageInput({ currentChatInfo, setIsFileUploaded }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSecurityModal, setSecurityModal] = useState(false);
  const [sensitiveDataList, setSensitiveDataList] = useState([]);
  const [editedvalues, setEditedValues] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const fileInputRef = useRef(null);
  const [fileSecurity, setFileSecurity] = useState("Open");

  const initialValues = {
    message: "",
    file: "",
  };

  const messageSchema = Yup.object({
    message: Yup.string().required("Message is required"),
    file: Yup.mixed()
      .required()
      .test(
        "FILE_SIZE",
        "Too big!",
        (value) => value && value.size < 1024 * 1024
      )
      .test(
        "FILE_TYPE",
        "Invalid File Type!",
        (value) =>
          value &&
          ["image/png", "image/jpeg", "application/pdf"].includes(value.type)
      ),
  });

  const handleFileSecurityChange = (event) => {
    setFileSecurity(event.target.value); // Update fileSecurity state based on selected radio button
  };


  const handleSendMessage = (values, { resetForm }) => {
    if (values.message.trim() !== "") {
      const editedvalues = {
        chatId: currentChatInfo.chat_id,
        userId: currentChatInfo.userId,
        securityLevel: currentChatInfo.seclvl,
        chatPassword: currentChatInfo.pass,
        fileSecurity: fileSecurity,
        fileName: values.file ? values.file.name : null,
        ...values,
      };
      let sensitiveList = textScanning(values.message);
      console.log(currentChatInfo.seclvl)
      console.log(values.file)
      if (sensitiveList.length > 0) {
        setShowModal(true);
        setSensitiveDataList(sensitiveList);
        setEditedValues(editedvalues);
      } else if (currentChatInfo.seclvl == "Sensitive" && values.file) {
        setSecurityModal(true);
        setEditedValues(editedvalues);
      } else {
        setEditedValues(editedvalues);
        setConfirm(true);
      }

      resetForm();
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    }
  };

  const handleEmojiClick = (emojiData) => {
    setFieldValue("message", messageText + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const sensitiveData = [
    /^[SFTG]\d{7}[A-Z]$/, // NRIC
    /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/, // IPv4
    /^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/, // Mastercard
    /\b([4]\d{3}[\s]\d{4}[\s]\d{4}[\s]\d{4}|[4]\d{3}[-]\d{4}[-]\d{4}[-]\d{4}|[4]\d{3}[.]\d{4}[.]\d{4}[.]\d{4}|[4]\d{3}\d{4}\d{4}\d{4})\b/, // Visa
    /^3[47][0-9]{13}$/, // Amex
    /\b[\w.-]{0,25}@(yahoo|hotmail|gmail)\.com\b/, // Email
  ];

  const textScanning = (text) => {
    const sensitiveList = [];
    const words = text.split(/\s+/); // Split the text into words
    for (let word of words) {
      for (let pattern of sensitiveData) {
        const match = pattern.test(word);
        if (match) {
          sensitiveList.push(word);
        }
      }
    }

    return sensitiveList;
  };

  useEffect(() => {
    if (editedvalues && confirm) {
      fileUpload(editedvalues);

      setEditedValues(null);
      setConfirm(false);
    }
  }, [editedvalues, confirm]);

  

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={messageSchema}
        onSubmit={handleSendMessage}
      >
        {({ setFieldValue, errors, values }) => (
          <Form>
            {values.file && <PreviewImage file={values.file} />}

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
              <label htmlFor="file" className="text-white text-2xl cursor-pointer">
                  <Tooltip title="Upload file" placement="top">
                    <ion-icon name="document-outline"></ion-icon>
                  </Tooltip>
              </label>
              
              <input
                type="file"
                name="file"
                id="file"
                onChange={(e) => {
                  setFieldValue("file", e.target.files[0]);
                  setIsFileUploaded(true);
                }}
                ref={fileInputRef}
                hidden
              />
              
              {values.file ? (
                <Tooltip title="Remove file" placement="top">
                  <button
                    className="text-white text-2xl ml-2 "
                    onClick={() => {
                      setFieldValue("file", null);
                      fileInputRef.current.value = null;
                      setIsFileUploaded(false);
                    }}
                  >
                    <ion-icon name="close-circle-outline"></ion-icon>
                  </button>
              </Tooltip>
                
              ) : null}
            

              {/* {errors.file && <p style={{ color: "red" }}>{errors.file}</p>} */}
              <Field
                type="text"
                placeholder="Message"
                className="block w-full py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700"
                name="message"
                onChange={(e) => {
                  setFieldValue("message", e.target.value);
                }}
              />
              <button
                type="submit"
                className="text-white bg-transparent text-2xl px-2 py-1"
                onClick={() => {
                  setIsFileUploaded(false);
                }}
              >
                <ion-icon name="send"></ion-icon>
              </button>
            </div>
          </Form>
        )}
      </Formik>

      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-md">
            <h2>Sensitive Data detected!</h2>
            {sensitiveDataList.length > 0 ? (
              <div>
                <p>The following sensitive data was found:</p>
                <ul>
                  {sensitiveDataList.map((data, index) => (
                    <li key={index} className="italic">
                      {data}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>No sensitive data detected.</p>
            )}

            <p className="font-bold mt-4">
              You're attempting to send a message with sensitive data. Do you
              want to proceed?
            </p>
            <div className="flex justify-evenly mt-4">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setConfirm(true);
                }}
                className="bg-green-500 text-white px-4 py-2 rounded-md"
              >
                Send anyway
              </button>
            </div>
          </div>
        </div>
      )}
      {showSecurityModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-md">
            <h2>Select file security</h2>
            <input 
            type="radio" 
            name="fileSecurity" 
            id="open" 
            value="Open"
            checked={fileSecurity === "Open"} 
            onChange={handleFileSecurityChange} 
            />
            <label htmlFor="open">Open</label>
            
            
            <input
              type="radio"
              name="fileSecurity"
              id="sensitive"
              value="Sensitive"
              checked={fileSecurity === "Sensitive"} 
              onChange={handleFileSecurityChange} 
              
            />
            <label htmlFor="sensitive">Sensitive</label>
              
            <button
              type="button"
              onClick={() => {
                setSecurityModal(false);
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => {
                setEditedValues(prevValues => ({...prevValues, fileSecurity: fileSecurity}));
                setSecurityModal(false);
                setConfirm(true);
              }}
              className="bg-green-500 text-white px-4 py-2 rounded-md"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default MessageInput;
