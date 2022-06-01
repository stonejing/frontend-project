/**
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {*} vsSource 
 * @param {*} fsSource 
 */
export function initShaderProgram(gl, vsSource, fsSource)
{
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
  {
    alert("Unable to initialize the shader program: " + 
      gl.getProgramInfoLog(shaderProgram));
    return null;
  }
  return shaderProgram;
}

/**
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {*} type 
 * @param {*} source 
 */
export function loadShader(gl, type, source)
{
  const shader = gl.createShader(type);

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
  {
    alert("An error occurred compiling the shader: " + 
      gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/**
 * 
 * @param {WebGLRenderingContext} gl 
 */
export function initBuffers(gl)
{
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const positions = [
    -1.0, -1.0,
    1.0,  -1.0,
    1.0,  1.0,
    -1.0, 1.0,
  ];

  gl.bufferData(gl.ARRAY_BUFFER, 
                new Float32Array(positions), 
                gl.STATIC_DRAW);


  const textureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

  const textureCoordinates = [
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
                gl.STATIC_DRAW);
  return {
    position: positionBuffer,
    textureCoord: textureCoordBuffer,
  };
}

/**
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {*} programInfo 
 * @param {*} buffers 
 * @param {*} deltaTime 
 * @param {*} cubeRotation 
 * @param {*} setCubeRotation 
 */
export function drawImageWebGL(
  gl,
  programInfo,
  buffers,
  url,
  kernels,
  option
) {

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  const level = 0;
  const internalFormat = gl.RGBA;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;

  const image = new Image();
  image.src = url;
  image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // In WebGL2, the image size can not be pow of 2.
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    // gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);
 
    gl.canvas.width = image.width;
    gl.canvas.height = image.height;

    gl.viewport(0, 0, image.width, image.height);

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);;

    {
      const numComponents = 2;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
      gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset
      );
      gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    }

    {
      const numComponents = 2;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
      gl.vertexAttribPointer(
        programInfo.attribLocations.textureCoord,
        numComponents,
        type,
        normalize,
        stride,
        offset
      );
      gl.enableVertexAttribArray(
        programInfo.attribLocations.textureCoord
      );
    }

    gl.useProgram(programInfo.program);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

    function computeKernelWeight(kernel) {
      var weight = kernel.reduce(function(prev, curr) {
          return prev + curr;
      });
      return weight <= 0 ? 1 : weight;
    }

    // set the resolution
    // gl.uniform2f(programInfo.uniformLocations.uSampler, gl.canvas.width, gl.canvas.height);

    // set the size of the image
    gl.uniform2f(programInfo.uniformLocations.textureSizeLocation, image.width, image.height);

    // set the kernel and it's weight
    gl.uniform1fv(programInfo.uniformLocations.kernelLocation, kernels[option]);
    gl.uniform1f(programInfo.uniformLocations.kernelWeightLocation, computeKernelWeight(kernels[option]));

    {
      let primitiveType = gl.TRIANGLE_FAN;
      let offset = 0;
      let count = 4;
      gl.drawArrays(primitiveType, offset, count);
    }
  };
}