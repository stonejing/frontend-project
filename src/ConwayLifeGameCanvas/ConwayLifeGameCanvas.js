import React, {useState, useEffect, useRef} from "react";

function getNeighbors(board, x, y, m, n)
{
    let cnt = 0;
    for(let i = x - 1; i <= x + 1; i++)
    {
        for(let j = y - 1; j <= y + 1; j++)
        {
            if(i >= 0 && j >= 0 && i < m && i < n)
            {
                if(i != x || j != y) 
                    cnt += board[i][j] & 0x01;
            }
        }
    }
    return cnt;
}

function gameOfLife(board, m, n)
{
    let temp_board = board;
    for(let i = 0; i < m; i++)
    {
        for(let j = 0; j < n; j++)
        {
            let nebs = getNeighbors(board, i, j, m, n);
			if(nebs === 2) board[i][j] |= (board[i][j] & 0x1) << 1; // 保持不变
			else if(nebs === 3) board[i][j] |= 0x2; // 增生
			else board[i][j] &= 0x1; // 死亡
        }
    }
    for(let i = 0; i < m; i++)
    {
        for(let j = 0; j < n; j++)
        {
            temp_board[i][j] >>= 1;
        }
    }
    board = temp_board;
}

function ConwayLifeGameCanvas()
{
    const canvasRef = useRef(null);
    const board = useRef(null);

    let bw = 800, bh = 600; // 画布宽、高
    let pad = 15; // 格子大小
    let m_p = parseInt(bw/pad);
    let n_p = parseInt(bh/pad);

    useEffect(() => {
    
        for(let i = 0; i < m_p; ++i) {
            board[i] = [];
            for(let j = 0; j < n_p; ++j)
            {
                board[i][j] = 0; 
            }
                // board[i][j] = Math.round(Math.random());
        }
        board[3][4] = 1;
        board[3][5] = 1;
        board[3][6] = 1;
    }, [])

    const draw = (ctx, frameCount, e) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.moveTo(0, 0);
        ctx.lineTo(200, 100);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(95, 50, 40, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }

    const drawBoard = (ctx, board, m, n) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        for(let x = 0; x <= bw; x += 20)
        {
            ctx.moveTo(x + pad, pad);
            ctx.lineTo(x + pad, bh + pad);
        }
        for(let x = 0; x <= bh; x += 20)
        {
            ctx.moveTo(pad,x + pad);
            ctx.lineTo(bw + pad, x + pad);
        }

        for(let i = 0; i < m; i++)
        {
            for(let j = 0; j < n; j++)
            {
                if(board[i][j] & 0x1) {
                    ctx.beginPath();
                    ctx.arc((i+1/2)*pad, (j+1/2)*pad, pad/2, 0, 2*Math.PI);
                    ctx.fillStyle = 'green';
                    // ctx.fillStyle = randomColor();
                    ctx.fill();
                }
                else {
                    ctx.clearRect(i*pad, j*pad, pad, pad);
                }
                ctx.beginPath();
                ctx.lineWidth = "1";
                ctx.strokeStyle="black";
                ctx.rect(i*pad, j*pad, pad, pad);
                ctx.stroke();
            }
        }
        ctx.strokeStyle = "black";
        ctx.stroke();
    }

    function click(e)
    {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        console.log(e.pageX); 
        console.log(e.pageY);
        let x = parseInt(e.pageX/pad - 0.5);
		let y = parseInt(e.pageY/pad - 0.5);
        board[x][y] = (board[x][y] & 0x1) ^ 0x1;
        board[x][y+1] = (board[x][y+1] & 0x1) ^ 0x1;
        board[x][y+2] = (board[x][y+2] & 0x1) ^ 0x1;
        drawBoard(context, board, m_p, n_p);
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        // draw(context);
        // drawBoard(context, board, m_p, n_p);

        const timer = setInterval(() => {
            gameOfLife(board, m_p, n_p);
            drawBoard(context, board, m_p, n_p);
        }, 500)

        return () => {
            clearInterval(timer);
        }

        // let frameCount = 0;
        // let animationFrameId;

        // const render = () => {
        //     frameCount++;
        //     draw(context, frameCount);
        //     animationFrameId = window.requestAnimationFrame(render);
        // }
        // render();
        // return () => {
        //     window.cancelAnimationFrame(animationFrameId);
        // }
    }, [])

    return (
        <div style={{width: "1000px", height: "auto"}}>
            <canvas ref={canvasRef} onClick={click} width="600px" height="600px" style={{border:"1px solid #000000"}}>

            </canvas>
        </div>
    );
}

export default ConwayLifeGameCanvas;