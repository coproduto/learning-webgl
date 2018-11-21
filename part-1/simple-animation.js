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
};

const setColorMask = (ctx) =>
      ctx.colorMask(colorMask[0], colorMask[1], colorMask[2], true);

const switchMask = (ctx) => {
  colorMaskIndex = (colorMaskIndex + 1) % 4;
  colorMask = [
    colorMaskIndex != 1,
    colorMaskIndex != 2,
    colorMaskIndex != 3
  ];
  console.log(colorMask);
  setColorMask(ctx);
};

const onXthFrame = (x, fun) => {
  let frameCount = 0;
  return function onRelevantFrame() {
    frameCount += 1;
    if (frameCount >= x) {
      fun();
      frameCount = 0;
    }
  }
};

let animationRunning = false;
let currentFrame = 0;
let colorMaskIndex = 0;
let colorMask = [true, true, true];

window.addEventListener("load", function initWebGL (evt) {
  window.removeEventListener(evt.type, initWebGL, false);
  const theCanvas = document.getElementById("the-canvas");
  
  getWebGLContext(
    theCanvas,
    (ctx) => {
      ctx.viewport(0, 0, ctx.drawingBufferWidth, ctx.drawingBufferHeight);
      setColorMask(ctx)
      ctx.clearColor(0, 0.5, 0.0, 1.0);
      ctx.clear(ctx.COLOR_BUFFER_BIT);

      const runColorChange = onXthFrame(120, () => switchColor(ctx));
      const runMaskChange = onXthFrame(360, () => switchMask(ctx));

      theCanvas.addEventListener("click", () => {
	animationRunning = !animationRunning;
	if (animationRunning) {
	  window.requestAnimationFrame(function animate() {
	    currentFrame += 1;

	    runColorChange();
	    runMaskChange();
	    ctx.clear(ctx.COLOR_BUFFER_BIT);
	    
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
