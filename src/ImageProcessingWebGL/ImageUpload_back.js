import { useEffect, useRef } from "react";
import lenna from './lenna.png';
import lenna_gray from './lenna_gray.png';
import { vsSource, fsSource } from "./showImageShader";

export default function ShowImage() {

  const canvasRef = useRef(null);
  
  useEffect(() => {
    const ctx3d = canvasRef.current.getContext('webgl2');

    var img, tex, vloc, tloc, vertexBuff, texBuff;
    var vertShaderObj = ctx3d.createShader(ctx3d.VERTEX_SHADER);
    var fragShaderObj = ctx3d.createShader(ctx3d.FRAGMENT_SHADER);
    ctx3d.shaderSource(vertShaderObj, vsSource);
    ctx3d.shaderSource(fragShaderObj, fsSource);
    ctx3d.compileShader(vertShaderObj);
    ctx3d.compileShader(fragShaderObj);
  
    var progObj = ctx3d.createProgram();
    ctx3d.attachShader(progObj, vertShaderObj);
    ctx3d.attachShader(progObj, fragShaderObj);
  
    ctx3d.linkProgram(progObj);
    ctx3d.useProgram(progObj);
  
    vertexBuff = ctx3d.createBuffer();
    ctx3d.bindBuffer(ctx3d.ARRAY_BUFFER, vertexBuff);
    ctx3d.bufferData(ctx3d.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]), ctx3d.STATIC_DRAW);
  
    texBuff = ctx3d.createBuffer();
    ctx3d.bindBuffer(ctx3d.ARRAY_BUFFER, texBuff);
    ctx3d.bufferData(ctx3d.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]), ctx3d.STATIC_DRAW);
  
    vloc = ctx3d.getAttribLocation(progObj, 'aVertexPosition');
    tloc = ctx3d.getAttribLocation(progObj, 'aTextureCoord');

    ctx3d.pixelStorei(ctx3d.UNPACK_FLIP_Y_WEBGL, true);;
  
    var drawImage = function(imgobj, x, y, w, h) {
      tex = ctx3d.createTexture();
      ctx3d.bindTexture(ctx3d.TEXTURE_2D, tex);
      ctx3d.texParameteri(ctx3d.TEXTURE_2D, ctx3d.TEXTURE_MIN_FILTER, ctx3d.NEAREST);
      ctx3d.texParameteri(ctx3d.TEXTURE_2D, ctx3d.TEXTURE_MAG_FILTER, ctx3d.NEAREST);
      ctx3d.texImage2D(ctx3d.TEXTURE_2D, 0, ctx3d.RGBA, ctx3d.RGBA, ctx3d.UNSIGNED_BYTE, imgobj);
  
      ctx3d.enableVertexAttribArray(vloc);
      ctx3d.bindBuffer(ctx3d.ARRAY_BUFFER, vertexBuff);
      ctx3d.vertexAttribPointer(vloc, 2, ctx3d.FLOAT, false, 0, 0);
  
      ctx3d.enableVertexAttribArray(tloc);
      ctx3d.bindBuffer(ctx3d.ARRAY_BUFFER, texBuff);
      ctx3d.bindTexture(ctx3d.TEXTURE_2D, tex);
      ctx3d.vertexAttribPointer(tloc, 2, ctx3d.FLOAT, false, 0, 0);
  
      ctx3d.drawArrays(ctx3d.TRIANGLE_FAN, 0, 4);
    };
  
    img = new Image();
    img.src = lenna_gray;
  
    img.onload = function() {
      console.log('drawing base image now');
      ctx3d.viewport(0, 0, img.width, img.height);
      ctx3d.canvas.width = img.width;
      ctx3d.canvas.height = img.height;

      drawImage(this, 0, 0, 64, 64);
    };
  })

  return (
    <div>
      <canvas ref={canvasRef}>

      </canvas>
    </div>
  )
}
