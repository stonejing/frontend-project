import React, {useState, useEffect, useRef} from "react";
import { WindowToScreen, DeepCopy, InitiateBoard } from './utils';

function ConwayLifeGameCanvas()
{
    const canvasRef = useRef(null);
    const [board, setBoard] = useState([]);

    /**
     * 
     * @param {CanvasRenderingContext2D} context 
     */
    const drawGrid = (context, color, stepx, stepy) => {
        context.strokeStyle = color;
        context.lineWidth = 0.5;

        for(let i = 0.5; i < context.canvas.width; i += stepx)
        {
            context.beginPath();
            context.moveTo(i, 0);
            context.lineTo(i, context.canvas.height);
            context.stroke();
        }
        for(let i = 0.5; i < context.canvas.height; i += stepy)
        {
            context.beginPath();
            context.moveTo(0, i);
            context.lineTo(context.canvas.width, i);
            context.stroke();
        }
    }

    const drawBoard = (context, board) => {
        for(let i = 0; i < board.length; i++)
        {
            for(let j = 0; j < board[0].length; j++)
            {
                if(board[i][j] === 1)
                {
                    let x = 10 * i;
                    let y = 10 * j;
                    context.fillRect(x, y, 10, 10);
                }
            }
        }
    }

    const onMouseClick = (e) => {
        e.preventDefault();
        let loc = WindowToScreen(canvasRef.current, e.clientX, e.clientY);
        console.log(loc.x.toFixed(0), loc.y.toFixed(0));
        // let context = canvasRef.current.getContext('2d');
        let x = loc.x.toFixed(0) - 2;
        let y = loc.y.toFixed(0) - 2;
        // context.fillRect(x - x % 10, y - y % 10, 10, 10);
        let newBoard = DeepCopy(board);
        // console.log(newBoard);
        newBoard[(x/10).toFixed(0)][(y/10).toFixed(0)] = 1;
        setBoard(newBoard);
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        drawGrid(context, 'lightgray', 10, 10);
        drawBoard(context, board);
    }, [onMouseClick])

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        setBoard(InitiateBoard(72, 54));

        drawGrid(context, 'lightgray', 10, 10);

        drawBoard(context, board);

        // const timer = setInterval(() => {
        //     gameOfLife(board, m_p, n_p);
        //     drawBoard(context, board, m_p, n_p);
        // }, 500)

        // return () => {
        //     clearInterval(timer);
        // }

        const gameOfLife = () => {
            if(board.length !== 0){
                let row = board.length;
                let column = board[0].length;
                let v1 = [1, 1, 0, -1, -1, -1, 0, 1];
                let v2 = [0, 1, 1, 1, 0, -1, -1, -1];
                let newBoard = DeepCopy(board);
                for(let i = 0; i < row; i++)
                {
                    for(let j = 0; j < column; j++)
                    {
                        let liveCell = 0;
                        for(let x = 0; x < v1.length; x++)
                        {
                            let newXCord = i + v1[x];
                            let newYCord = j + v2[x];
        
                            if(newXCord >= 0 && newYCord >= 0 && newXCord < row && newYCord < column)
                            {
                                if(newBoard[newXCord][newYCord] == 1)
                                    liveCell++;
                            }
                        }
                        if(newBoard[i][j] == 0 && liveCell == 3)
                            board[i][j] = 1;
                        else if(newBoard[i][j] == 1 && liveCell < 2 || liveCell > 3)
                            board[i][j] = 0;
                    }
                }
                setBoard(board);
            }
        }

        let animationFrameId;

        const render = () => {
            gameOfLife();
            animationFrameId = window.requestAnimationFrame(render);
        }
        render();
        return () => {
            window.cancelAnimationFrame(animationFrameId);
        }
    }, [])

    return (
        <div style={{justifyContent: "center"}}>
            <div style={{height: "36px"}}>
                <p> TEST </p>
            </div>
            <canvas ref={canvasRef} onClick={onMouseClick} width="721px" height="541px">

            </canvas>
        </div>
    );
}

export default ConwayLifeGameCanvas;