const getWebGLContext = (canvas, onDetect, onFail) => {
  const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  if (gl && gl instanceof WebGLRenderingContext) {
    return onDetect(gl);
  } else {
    return onFail();
  }
};

const switchColor = (ctx) => {
  ctx.clearColor(Math.random(), Math.random(), Math.random(), 1.0);
  ctx.clear(ctx.COLOR_BUFFER_BIT);
};

let animationRunning = false;
let currentFrame = 0;

window.addEventListener("load", function initWebGL (evt) {
  window.removeEventListener(evt.type, initWebGL, false);
  const theCanvas = document.getElementById("the-canvas");
  
  getWebGLContext(
    theCanvas,
    (ctx) => {
      ctx.viewport(0, 0, ctx.drawingBufferWidth, ctx.drawingBufferHeight);
      ctx.clearColor(0, 0.5, 0.0, 1.0);
      ctx.clear(ctx.COLOR_BUFFER_BIT);

      theCanvas.addEventListener("click", () => {
	animationRunning = !animationRunning;
	if (animationRunning) {
	  window.requestAnimationFrame(function animate() {
	    currentFrame += 1;

	    if (currentFrame >= 120) {
	      currentFrame = 0;
	      switchColor(ctx);  
	    }
	    
	    if (animationRunning) {
	      window.requestAnimationFrame(animate);
	    }
	  });
	} else {
	  currentFrame = 0;
	}
      }, false);
      console.log("Ready");
    },
    () => console.error("ERROR: No WebGL support detected.")
  );
});
