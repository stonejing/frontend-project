import React, {useState, useEffect, useRef} from "react";
import { InitiateBoard, 
  WindowToScreen, 
  GameofLifeDense,
  Uint8ClampedArrayToDense
} from "./utils";
import constructor from './constructor.png';

export default function ConwayLifeGamePixel()
{
  const canvasRef = useRef(null);
  const offscreenRef = useRef(null);
  const imageDataRef = useRef(null);
  const requestRef = useRef(null);

  const stepx = 1;
  const stepy = 1;

  const onMouseClick = (e) => {
    e.preventDefault();

    let loc = WindowToScreen(canvasRef.current, e.clientX, e.clientY);

    let x_cord = Math.floor(loc.x / stepx);
    let y_cord = Math.floor(loc.y / stepy);

    console.log(x_cord, y_cord);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const img = new Image();
    img.src = constructor;

    img.onload = () => {
      context.canvas.height = img.height;
      context.canvas.width = img.width;

      offscreenRef.current = new OffscreenCanvas(img.width, img.height);
      const offscreen = offscreenRef.current;
      const offscreenCtx = offscreen.getContext('2d');
      offscreenCtx.drawImage(img, 0, 0, img.width, img.height);
      const imgData = offscreenCtx.getImageData(0, 0, img.width, img.height);

      let denseMatrix = Uint8ClampedArrayToDense(imgData.data, img.width, img.height);
      imageDataRef.current = denseMatrix;
      context.fillRect(0, 0, img.width, img.height);
      const render = () => {

        context.fillStyle = 'rgba(0, 0, 0, .05)';
        context.fillRect(0, 0, img.width, img.height);
        context.fillStyle = "#ffff96";
        // context.fillStyle = "#E74C3C";

        GameofLifeDense(imageDataRef);

        for(let i = 0; i < imgData.width; i++)
        {
          for(let j = 0; j < imgData.height; j++)
          {
            if(imageDataRef.current[i][j] === 1)
            {
              context.fillRect(j, i, 1, 1);
            }
          }
        }
        if(requestRef.current !== null)
          requestRef.current = requestAnimationFrame(render);
      }

      requestRef.current = requestAnimationFrame(render);
    }

    return () => {
      requestRef.current = null;
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
  }, [])

  return (
    <div style={{ justifyContent: "center" }}>
      <div style={{ height: "32px" }}>
        <p> CSS IS GOOD </p>
      </div>
      <canvas ref={canvasRef} onClick={onMouseClick}>

      </canvas>
    </div>
  );
}