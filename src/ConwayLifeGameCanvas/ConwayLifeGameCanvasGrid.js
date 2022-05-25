import React, { useState, useEffect, useRef } from "react";
import { WindowToScreen, RandomBoard, GameofLife } from './utils';

export function ConwayLifeGameCanvasGrid() {
  const canvasRef = useRef(null);
  const boardRef = useRef(null);

  const stepx = 5;
  const stepy = 5;

  /**
   * 
   * @param {CanvasRenderingContext2D} context 
   */
  const drawGrid = (context, color, stepx, stepy) => {
    context.strokeStyle = color;
    context.lineWidth = 0.5;
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    for (let i = 0.5; i < context.canvas.width; i += stepx) {
      context.beginPath();
      context.moveTo(i, 0);
      context.lineTo(i, context.canvas.height);
      context.stroke();
    }
    for (let i = 0.5; i < context.canvas.height; i += stepy) {
      context.beginPath();
      context.moveTo(0, i);
      context.lineTo(context.canvas.width, i);
      context.stroke();
    }
  }

  /**
   * 
   * @param {CanvasRenderingContext2D} context 
   * @param {*} boardRef 
   * @param {*} stepx 
   * @param {*} stepy 
   */
  const drawBoard = (context, boardRef, stepx, stepy) => {
    for (let i = 0; i < boardRef.current.length; i++) {
      for (let j = 0; j < boardRef.current[0].length; j++) {
        if (boardRef.current[i][j] === 1) {
          let x = stepx * i;
          let y = stepy * j;
          context.fillRect(x, y, stepx, stepy);
        }
      }
    }
  }

  const onMouseClick = (e) => {
    e.preventDefault();

    let loc = WindowToScreen(canvasRef.current, e.clientX, e.clientY);

    console.log(parseInt(loc.x / stepx), parseInt(loc.y / stepy));

    let x_cord = parseInt(loc.x / stepx);
    let y_cord = parseInt(loc.y / stepy);

    boardRef.current[x_cord][y_cord] = 1;
    boardRef.current[x_cord][y_cord + 1] = 1;
    boardRef.current[x_cord][y_cord - 1] = 1;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const height = canvas.height;
    const width = canvas.width;

    // boardRef.current = InitiateBoard(parseInt(width / stepx),parseInt(height / stepy));

    boardRef.current = RandomBoard(parseInt(width / stepx), parseInt(height / stepy));

    drawGrid(context, 'lightgray', stepx, stepy);

    drawBoard(context, boardRef, stepx, stepy);

    // const timer = setInterval(() => {
    //     drawGrid(context, 'lightgray', stepx, stepy);
    //     drawBoard(context, boardRef, stepx, stepy);
    //     GameofLife(boardRef);
    //     // animationFrameId = window.requestAnimationFrame(render);
    // }, 500)

    // return () => {
    //     clearInterval(timer);
    // }

    // let frameCount = 0;
    let animationFrameId;

    const render = () => {
      // draw(context, frameCount);
      GameofLife(boardRef);
      drawGrid(context, 'lightgray', stepx, stepy);
      drawBoard(context, boardRef, stepx, stepy);
      animationFrameId = window.requestAnimationFrame(render);
    }
    render();
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    }
  }, [])

  return (
    <div style={{ justifyContent: "center" }}>
      <div style={{ height: "32px" }}>
        <p> CSS IS GOOD </p>
      </div>
      <canvas ref={canvasRef} onClick={onMouseClick} width="1030px" height="575px">

      </canvas>
    </div>
  );
}