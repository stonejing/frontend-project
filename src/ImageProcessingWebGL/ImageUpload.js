import React, { useRef, useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { initShaderProgram, initBuffers, drawImageWebGL } from './gl.js';
// import { vsSource, fsSource } from './showImageShader';
import { vsSource, fsSource } from './imagePrcessingShader';
import lenna from './lenna_gray.png';
import { kernels } from './utils.js';

// Define several convolution kernels
let initialSelection = 'edgeDetect2';

const options = function(kernels) {
  let result = [];
  for(let item in kernels)
  {
    result.push(<option value={item} key={item}>{item}</option>)
  }
  return result;
}

export default function WebGLTutorial()
{
  const glCanvas = useRef(null);
  const [fileUrl , setFileUrl] = useState(null);
  const [kernelMask, setKernelMask] = useState('edgeDetect2');
  const [time, setTime] = useState();

  const processImage = (event) => {
    const imageFile = event.target.files[0];
    if(imageFile)
    {
      const imageUrl = URL.createObjectURL(imageFile);
      setFileUrl(imageUrl);
    }
  }

  const changeMask = (e) => {
    setKernelMask(e.target.value);
  }

  useEffect(() => {
    let start = performance.now();
    const canvas = glCanvas.current;
    /** @type {WebGLRenderingContext} */
    const gl = canvas.getContext("webgl2");

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    const programInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
      },
      uniformLocations: {
        uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
        textureSizeLocation: gl.getUniformLocation(shaderProgram, 'uTextureSize'),
        kernelLocation: gl.getUniformLocation(shaderProgram, 'uKernel[0]'),
        kernelWeightLocation: gl.getUniformLocation(shaderProgram, 'uKernelWeight'),
      },
    };

    const buffers = initBuffers(gl);

    const url = fileUrl ? fileUrl : lenna;

    drawImageWebGL(gl, programInfo, buffers, url, kernels, kernelMask);
    let end = performance.now();

    setTime((end - start).toFixed(2));

  }, [fileUrl, kernelMask])

  return (
    <div>
      <input
        accept="image/*"
        id="contained-button-file"
        multiple
        style={{display: "none"}}
        onChange={processImage}
        type="file"
      />
      <label htmlFor="contained-button-file">
        <Button variant="contained" color="secondary" component="span">
          Upload
        </Button>
      </label>
      <select onChange={changeMask} defaultValue={initialSelection}>
        {options(kernels)}
      </select>
      <div>{time}ms</div>
      <canvas ref={glCanvas}> </canvas>
    </div>
  )

}