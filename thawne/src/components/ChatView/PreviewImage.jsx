import defaultImage from "../../assets/png.png";
import React, { useState, useEffect } from "react";
import getFileFromUrl from "../../assets/png.png";

export const PreviewImage = ({ file }) => {
  const [preview, setPreview] = useState(null);

  console.log(file);

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
    <div className="relative w-full p-8 h-[40rem] flex flex-col justify-center items-center">
      <div className="mb-2 text-white font-medium text-lg">
        <p>{file.name}</p>
      </div>
      <img className="max-w-full max-h-full mb-2" src={preview} alt="" width={500} height={600}/>
      <div className="mt-4">
        <p className="text-white font-light">Size: {file.size}B</p>
      </div>
    </div>
  );
};
