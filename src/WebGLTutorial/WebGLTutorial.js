import React, { useRef, useState, useEffect } from 'react';

import { initShaderProgram, initBuffers, drawScene, loadTexture } from './gl.js';
import { vsSource, fsSource } from './shaders';
import lenna from './lenna.png';

export default function WebGLTutorial()
{
  const glCanvas = useRef(null);

  useEffect(() => {

    const canvas = glCanvas.current;
    /** @type {WebGLRenderingContext} */
    const gl = canvas.getContext("webgl");

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    let cubeRotation = 0.0;

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    const programInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
        textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
      },
      uniformLocations: {
        projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
        modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
        uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
      },
    };

    const buffers = initBuffers(gl);

    const texture = loadTexture(gl, lenna);

    let then = 0;

    function render(now) {
      now *= 0.001;
      const deltaTime = now - then;
      then = now;

      cubeRotation = drawScene(gl, programInfo, buffers, 
                              deltaTime, cubeRotation, texture);
      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);

  }, [])

  return (
    <canvas height="480" width="640" ref={glCanvas}>

    </canvas>
  )

}