let ctx = null;
let canvas;
let offScreenCtx;
let width = 0;
let height = 0;
let lastFrame = null;
self.onmessage = e => {
  // canvasWorker.transferFromImageBitmap(e.data.imageBitmap);
  if (e.data.canvas) {
    canvas = e.data.canvas;
    ctx = canvas.getContext("2d");
    width = canvas.width;
    height = canvas.height;
    offScreenCtx = new OffscreenCanvas(width, height).getContext("2d");

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);
  } else if (e.data.frame) {
    const { width, height } = e.data
    canvas.width = width
    canvas.height = height
    ctx.drawImage(e.data.frame, 0, 0, width, height);
    // offScreenCtx = new OffscreenCanvas(width, height).getContext("2d");
    // offScreenCtx.drawImage(e.data.frame, 0, 0, width, height);
    // const imgData = offScreenCtx.getImageData(0, 0, width, height);
    // if (!e.isHidden) {
    //   ctx.putImageData(imgData, 0, 0);
    // }
    if (lastFrame) {
      lastFrame.close();
    }
    lastFrame = e.data.frame  
  } else if (e.data.message == "close") {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else if (e.data.message == "snapshot") {
    const { width, height } = e.data;
    var imgData = "";
    let screenShotCtx = new OffscreenCanvas(width, height).getContext("2d");
    screenShotCtx.drawImage(lastFrame, 0, 0, width, height);
    imgData = screenShotCtx.getImageData(0, 0, width, height);
    self.postMessage({
      message: "snapshot",
      imgData
    });
  }
};
