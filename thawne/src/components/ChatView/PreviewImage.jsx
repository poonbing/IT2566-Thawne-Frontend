import React, { useState, useEffect } from 'react';

const PreviewImage = ({ file }) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null); // Clear preview if no file is selected
    }
  }, [file]);

  return (
    <div>
      {preview ? (
        <img src={preview} alt="preview" style={{ maxWidth: '100px' }} />
      ) : (
        "No preview available"
      )}
    </div>
  );
};

export default PreviewImage;
