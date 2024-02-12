import React, { useState, useEffect, useRef } from "react";
import EmojiPicker from "emoji-picker-react";
import * as Yup from "yup";
import { Formik, Form, Field, useFormik } from "formik";
import { submitMessage } from "../../api/chatApi";
import { fileUpload } from "../../api/chatApi";
import { PreviewImage } from "./PreviewImage";
import Tooltip from '@mui/material/Tooltip';
import { createWorker } from 'tesseract.js';
import { logEvent } from "../../api/logApi";

function MessageInput({ currentChatInfo, setIsFileUploaded, userPassword }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSecurityModal, setSecurityModal] = useState(false);
  const [sensitiveDataList, setSensitiveDataList] = useState([]);
  const [maskSensitiveList, setMaskSensitiveList] = useState([]);
  const [editedvalues, setEditedValues] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const fileInputRef = useRef(null);
  const [fileSecurity, setFileSecurity] = useState("Open");
  const [selectedImage, setSelectedImage] = useState(null);
  const [textResult, setTextResult] = useState("");


  const convertImageToText = async () => {
    try{
      const worker = await createWorker('eng');
      const { data } = await worker.recognize(selectedImage)
      setTextResult(data.text)
    } catch (error){
      console.log("Error proccessing OCR:", error)
    }
    
  }

  useEffect(() => {
    convertImageToText();
  }, [selectedImage])
  

  const initialValues = {
    message: "",
    file: "",
  };

  const messageSchema = Yup.object({
    message: Yup.string(),
    file: Yup.mixed()
  });

  const handleFileSecurityChange = (event) => {
    setFileSecurity(event.target.value); // Update fileSecurity state based on selected radio button
  };


  const handleSendMessage = (values, { resetForm }) => {
    if (values.message.trim() !== "" || values.file !== "") {
      const editedvalues = {
        chatId: currentChatInfo.chat_id,
        userId: currentChatInfo.userId,
        securityLevel: currentChatInfo.seclvl,
        chatPassword: currentChatInfo.pass,
        fileSecurity: fileSecurity,
        fileName: values.file ? values.file.name : null,
        ...values,
      };
      console.log(editedvalues)
      let sensitiveList = textScanning(values.message);
      let maskList = maskScanning(values.message);
      let ocrList = textScanning(textResult)
      
      
      if (sensitiveList.length > 0) {
        setShowModal(true);
        setSensitiveDataList(sensitiveList);
        setMaskSensitiveList(maskList)
        setEditedValues(editedvalues);
      } else if (ocrList.length > 0){
        setShowModal(true)
        setSensitiveDataList(ocrList)
        setEditedValues(editedvalues)
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


  const sendMaskMessage = () => {
    if (maskSensitiveList.length > 0){
      let maskMessage = editedvalues.message
      sensitiveDataList.forEach((sensitiveWord, index) => {
        maskMessage = maskMessage.replace(sensitiveWord, maskSensitiveList[index])
      })
      editedvalues.message = maskMessage
      setConfirm(true)
    }
  }

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

  const maskScanning = (text) => {
    const maskList = []
    const words = text.split(/\s+/); // Split the text into words
    for (let word of words) {
      for (let pattern of sensitiveData) {
        const match = pattern.test(word);
        if (match) {
          const last4Characters = word.slice(-4)
          const masked = 'x'.repeat(word.length - 4)
          const maskedWord = masked + last4Characters
          maskList.push(maskedWord);
        }
      }
    }
    
    return maskList;
  };

  

  useEffect(() => {
    if (editedvalues && confirm) {
      if (editedvalues.message === ''){
        fileUpload(editedvalues);
        if (sensitiveDataList && currentChatInfo.seclvl == 'Open'){
          const logInfo = {
            userId: currentChatInfo.userId,
            password: userPassword.password,
            type: 'Message.',
            location: 'Open channel.',
            context: "Sensitive data sent by image file."
          }
          console.log(logInfo)
          logEvent(logInfo)
        }
      }
      else{
        submitMessage(editedvalues)
        if (sensitiveDataList && currentChatInfo.seclvl == 'Open'){
          const logInfo = {
            userId: currentChatInfo.userId,
            password: userPassword.password,
            type: 'Message.',
            location: 'Open channel.',
            context: "Sensitive data sent."
          }
          console.log(logInfo)
          logEvent(logInfo)
        }
        
      }
      setEditedValues(null);
      setConfirm(false);
      setTextResult("");
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
            {textResult && (
              <div className="text-center text-white text-2xl">
                <p>{textResult}</p>
              </div>
            )}

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
                  setSelectedImage(e.target.files[0]);
                }}
                ref={fileInputRef}
                hidden
                disabled={values.message.trim() !== ""}
              />
              
              {values.file ? (
                <Tooltip title="Remove file" placement="top">
                  <button
                    className="text-white text-2xl ml-2 "
                    onClick={() => {
                      setFieldValue("file", "");
                      fileInputRef.current.value = "";
                      setIsFileUploaded(false);
                      setTextResult("");

                    }}
                  >
                    <ion-icon name="close-circle-outline"></ion-icon>
                  </button>
              </Tooltip>
                
              ) : null}
            
              <Field
                type="text"
                placeholder="Message"
                className="block w-full py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700"
                name="message"
                onChange={(e) => {
                  setFieldValue("message", e.target.value);
                }}
                disabled={values.file !== ""}
              />
              <button
                type="submit"
                className="text-white bg-transparent text-2xl px-2 py-1"
                onClick={() => {
                  setIsFileUploaded(false);
                }}
                hidden={values.message.trim() === "" && values.file === ""}
                disabled={values.message.trim() === "" && values.file === ""}
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
            <h2 className="font-bold">Sensitive Data detected!</h2>
            {sensitiveDataList.length > 0 ? (
              <div>
                <p className="font-semibold">The following sensitive data was found:</p>
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

            {maskSensitiveList.length > 0 ? (
              <div className="mt-2">
                <p className="font-semibold">Send message with mask instead:</p>
                <ul>
                  {maskSensitiveList.map((data, index) => (
                    <li key={index} className="italic">
                      {data}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>No masked data detected.</p>
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
                  setMaskSensitiveList([]);
                  setTextResult("");
                }}
                className="bg-red-600 text-white m-2 px-4 py-2 rounded-md hover:bg-red-700 transition-all ease-in-out duration-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  sendMaskMessage();
                }}
                hidden={maskSensitiveList.length == 0}
                className="bg-gray-700 text-white m-2 px-4 py-2 rounded-md hover:bg-gray-800 transition-all ease-in-out duration-300"
              >
                Mask it
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setConfirm(true);
                }}
                className="bg-gray-700 text-white m-2 px-4 py-2 rounded-md hover:bg-gray-800 transition-all ease-in-out duration-300"
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
            <label htmlFor="open">Open</label> <br />
            
            
            <input
              type="radio"
              name="fileSecurity"
              id="sensitive"
              value="Sensitive"
              checked={fileSecurity === "Sensitive"} 
              onChange={handleFileSecurityChange} 
              
            />
            <label htmlFor="sensitive">Sensitive</label> <br />
            <div className="m-2">
              <button
                type="button"
                onClick={() => {
                  setSecurityModal(false);
                }}
                className="bg-red-600 text-white m-2 px-4 py-2 rounded-md hover:bg-red-700 transition-all ease-in-out duration-300"
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
                className="bg-gray-700 text-white m-2 px-4 py-2 rounded-md hover:bg-gray-800 transition-all ease-in-out duration-300"
              >
                Send
              </button>

            </div>
              

          </div>
        </div>
      )}
    </>
  );
}

export default MessageInput;
