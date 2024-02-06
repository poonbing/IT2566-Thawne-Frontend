import defaultImage from "../../assets/png.png";
import React, { useState, useEffect } from "react";
import getFileFromUrl from "../../assets/png.png";

export const PreviewImage = ({ file }) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const loadPreview = async () => {
      if (file instanceof Blob) {
        if (file.type === "application/pdf") {
          setPreview(defaultImage);
        } else {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            setPreview(reader.result);
          };
        }
      }
    };

    loadPreview();
  }, [file]);


  return (
    <div className="relative w-full p-8 h-[40rem] flex justify-center items-center">
      <img className="max-w-full max-h-full" src={preview} alt="" />
    </div>
  );
};
