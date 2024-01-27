import React, { useState } from 'react'

export const PreviewImage = (file) => {
    const [preview, setPreview] = useState(null);
    const reader = new FileReader();
    
    if (file instanceof Blob) {
        reader.readAsDataURL(file);
        reader.onload = () => {
            setPreview(reader.result)
        }
    }
    else{
        console.log(file)
        console.log('File type', typeof file)
        console.log('File prototype:', Object.getPrototypeOf(file));
        console.log('Received file:', file instanceof Blob);
        console.log('Incorrect Instance')
    }

  return (
    <div>
        <img style={{width: "300px"}} src={preview} alt="" />
    </div>
  )
}
