

function OpenCVComponent() {

  
  return (
    <>
      <div className="bg-white">
        <video id="cam_input" hidden="True" height="240" width="320"></video>
        <canvas id="canvas_output"></canvas>
        <h1 id="statusText"></h1>
      </div>
    </>
  );
}

export default OpenCVComponent;
