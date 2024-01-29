import React, { useState, useEffect } from "react";

function OpenCVComponent() {


  return (
    <>
      <video id="cam_input" hidden="True" height="240" width="320"></video>
      <canvas id="canvas_output"></canvas>
      <h1 id="statusText"></h1>
    </>
  );
}

export default OpenCVComponent;
