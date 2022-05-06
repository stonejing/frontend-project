import React, {useRef, useEffect} from 'react';
import "./BreakOutCanvas.css";

function BreakOutCanvas()
{
    const canvasRef = useRef(null);

    let rightPressed = false;
    let leftPressed = false;

    function keyDownHandler(e)
    {
        if(e.key === "Right" || e.key === "ArrowRight")
        {
            rightPressed = true;
        }
        else if(e.key === "left" || e.key === "ArrowLeft")
        {
            leftPressed = true;
        }
    }

    function keyUpHandler(e)
    {
        if(e.key === "Right" || e.key === "ArrowRight")
        {
            rightPressed = false;
        }
        else if(e.key === "left" || e.key === "ArrowLeft")
        {
            leftPressed = false;
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', keyDownHandler);
        window.addEventListener('keyup', keyUpHandler);

        return () => {
            window.removeEventListener('keydown', keyDownHandler);
            window.removeEventListener('keyup', keyUpHandler);
        }
    })

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        let ballRadius = 10;
        let x = canvas.width / 2;
        let y = canvas.height - 30;
        let dx = 2;
        let dy = -2;
        let paddleHeight = 10;
        let paddleWidth = 300;
        let paddleX = (canvas.width - paddleWidth) / 2;
        
        let brickRowCount = 4;
        let brickColumnCount = 7;
        let brickWidth = 75;
        let brickHeight = 20;
        let brickPadding = 10;
        let brickOffsetTop = 30;
        let brickOffsetLeft = 30;

        let bricks = [];

        let score = 0;
        let lives = 3;

        function mouseMoveHandler(e)
        {
            let relativeX = e.clientX - canvas.offsetLeft;
            if(relativeX > 0 && relativeX < canvas.width)
            {
                paddleX = relativeX - paddleWidth / 2;
            }
        }

        document.addEventListener("mousemove", mouseMoveHandler, false);

        for(let c = 0; c < brickColumnCount; c++)
        {
            bricks[c] = [];
            for(let r = 0; r < brickRowCount; r++)
            {
                bricks[c][r] = {x: 0, y: 0, status: 1};
            }
        }

        let interval;

        function drawLives()
        {
            ctx.font = "16px Arial";
            ctx.fillStyle = "#0095DD";
            ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
        }

        function collisionDetection()
        {
            for(let c = 0; c < brickColumnCount; c++)
            {
                for(let r = 0; r < brickRowCount; r++)
                {
                    let b = bricks[c][r];
                    if(b.status === 1)
                    {
                        if(x > b.x && x < b.x + brickWidth && y > b.y
                            && y < b.y + brickHeight)
                        {
                            dy = -dy;
                            b.status = 0;
                            score++;
                            if(score === brickRowCount * brickColumnCount)
                            {
                                alert("YOU WIN, CONGRATULATIONS");
                                document.location.reload();
                                clearInterval(interval);
                            }
                        }
                    }
                }
            }
        }

        function drawScore()
        {
            ctx.font = "16px Arial";
            ctx.fillStyle = "#0095DD";
            ctx.fillText("Score: " + score, 8, 20);
        }

        function drawBricks(ctx)
        {
            for(let c = 0; c < brickColumnCount; c++)
            {
                for(let r = 0; r < brickRowCount; r++)
                {
                    if(bricks[c][r].status === 1)
                    {
                        let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                        let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                        bricks[c][r].x = brickX;
                        bricks[c][r].y = brickY;
                        ctx.beginPath();
                        ctx.rect(brickX, brickY, brickWidth, brickHeight);
                        ctx.fillStyle = "#0095DD";
                        ctx.fill();
                        ctx.closePath();
                    }
                }
            }
        }

        function drawBall(ctx)
        {
            ctx.beginPath();
            ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
            ctx.fillStyle = "0095DD";
            ctx.fill();
            ctx.closePath();
        }

        function drawPaddle(ctx)
        {
            ctx.beginPath();
            ctx.rect(paddleX, canvas.height - paddleHeight, 
                paddleWidth, paddleHeight);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();
        }
    
        function draw(ctx)
        {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBall(ctx);
            drawPaddle(ctx);
            drawBricks(ctx);
            collisionDetection();
            drawScore();
            drawLives();
    
            if((x + dx > canvas.width - ballRadius) || (x + dx < ballRadius))
            {
                dx = -dx;
            }
            if (y + dy < ballRadius)
            {
                dy = -dy;
            }
            else if(y + dy > canvas.height - ballRadius)
            {
                if(x > paddleX && x < paddleX + paddleWidth)
                {
                    dy = -dy;
                }
                else
                {
                    lives--;
                    if(!lives)
                    {
                        alert("GAME OVER!");
                        document.location.reload();
                        clearInterval(interval);
                        return;
                    }
                    else
                    {
                        x = canvas.width/2;
                        y = canvas.height-30;
                        dx = 2;
                        dy = -2;
                        paddleX = (canvas.width-paddleWidth)/2;
                    }
                }
            }

            if(rightPressed) 
            {
                paddleX += 7;
                if (paddleX + paddleWidth > canvas.width)
                {
                    paddleX = canvas.width - paddleWidth;
                }
            }
            else if(leftPressed) 
            {
                paddleX -= 7;
                if (paddleX < 0)
                {
                    paddleX = 0;
                }
            }

            x += dx;
            y += dy;
        }

        interval = setInterval(() => {
            draw(ctx);
        }, 10);

        return () => {
            clearInterval(interval);
        }
        // let animationFrameId;
        // const render = () => {
        //     draw(ctx);
        //     animationFrameId = window.requestAnimationFrame(render);
        // }
        // render();
        // return () => {
        //     window.cancelAnimationFrame(animationFrameId);
        // }
    }, []);

    return (
        <canvas ref={canvasRef} width="640" height="480" className="canvas">

        </canvas>
    );
}

export default BreakOutCanvas;         