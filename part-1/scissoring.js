const getWebGLContext = (canvas, onDetect, onFail) => {
  const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  if (gl && gl instanceof WebGLRenderingContext) {
    return onDetect(gl);
  } else {
    return onFail();
  }
};

let animationRunning = false;
let currentFrame = 0;
let colorMaskIndex = 0;
let colorMask = [true, true, true];
let scissor = [40, 20, 60, 130];

const switchColor = (ctx) =>
      ctx.clearColor(Math.random(), Math.random(), Math.random(), 1.0);

const setColorMask = (ctx) =>
      ctx.colorMask(colorMask[0], colorMask[1], colorMask[2], true);

const setScissor = (ctx) =>
      ctx.scissor(scissor[0], scissor[1], scissor[2], scissor[3]);

const switchMask = (ctx) => {
  colorMaskIndex = (colorMaskIndex + 1) % 4;
  colorMask = [
    colorMaskIndex != 1,
    colorMaskIndex != 2,
    colorMaskIndex != 3
  ];
  setColorMask(ctx);
};

const switchScissor = (ctx) => {
  const halfWidth = ctx.drawingBufferWidth / 2;
  const halfHeight = ctx.drawingBufferHeight / 2;
  scissor = [
    Math.random() * halfWidth,               // lower left x
    Math.random() * halfHeight + halfHeight, // lower left y
    Math.random() * halfWidth,               // width
    Math.random() * halfHeight               // height
  ];
  setScissor(ctx);
}

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

const setup = (ctx) => {
  ctx.enable(ctx.SCISSOR_TEST);

  ctx.viewport(0, 0, ctx.drawingBufferWidth, ctx.drawingBufferHeight);
  setColorMask(ctx);
  ctx.clearColor(0, 0.5, 0.0, 1.0);  
  ctx.clear(ctx.COLOR_BUFFER_BIT);
}

window.addEventListener("load", function initWebGL (evt) {
  window.removeEventListener(evt.type, initWebGL, false);
  const theCanvas = document.getElementById("the-canvas");

  getWebGLContext(
    theCanvas,
    (ctx) => {
      setup(ctx);

      const runColorChange = onXthFrame(120, () => switchColor(ctx));
      const runScissorChange = onXthFrame(240, () => switchScissor(ctx));
      const runMaskChange = onXthFrame(360, () => switchMask(ctx));

      theCanvas.addEventListener("click", () => {
	animationRunning = !animationRunning;
	if (animationRunning) {
	  window.requestAnimationFrame(function animate() {
	    runColorChange();
	    runScissorChange();
	    runMaskChange();

	    ctx.clear(ctx.COLOR_BUFFER_BIT);

	    if (animationRunning) {
	      window.requestAnimationFrame(animate);
	    }
	  });
	}
      });

      console.log("Ready");
    },
    () => console.error("ERROR: No WebGL support detected.")
  );
});
