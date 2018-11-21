const getWebGLContext = (canvas, onDetect, onFail) => {
  const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  if (gl && gl instanceof WebGLRenderingContext) {
    return onDetect(gl);
  } else {
    return onFail();
  }
};

window.addEventListener("load", function initWebGL (evt) {
  window.removeEventListener(evt.type, initWebGL, false);
  
  getWebGLContext(
    document.getElementById("the-canvas"),
    (ctx) => {
      ctx.viewport(0, 0, ctx.drawingBufferWidth, ctx.drawingBufferHeight);
      ctx.clearColor(0, 0.5, 0.0, 1.0);
      ctx.clear(ctx.COLOR_BUFFER_BIT);
      console.log("Done");
    },
    () => console.error("ERROR: No WebGL support detected.")
  );
});
