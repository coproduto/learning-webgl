const getWebGLContext = (canvas, onDetect, onFail) => {
  const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  if (gl && gl instanceof WebGLRenderingContext) {
    return onDetect(gl);
  } else {
    return onFail();
  }
}

window.addEventListener("load", () => getWebGLContext(
    document.createElement("canvas"),
    () => console.log("WebGL support detected."),
    () => console.log("No WebGL support detected.")
));
