
/**
 * 
 * @param {HTMLCanvasElement} canvas 
 * @param {number} x 
 * @param {number} y 
 */
export function WindowToScreen(canvas, x, y)
{
  let bbox = canvas.getBoundingClientRect();

  return {
    x: x - bbox.left * (canvas.width / bbox.width),
    y: y - bbox.top * (canvas.height / bbox.height)
  }
}

export function DeepCopy(items)
{
  return items.map(item => Array.isArray(item) ? DeepCopy(item) : item);
}

export function InitiateBoard(row, column)
{
  let board = [];
  for(let i = 0; i < row; i++)
  {
      let temp = [];
      for(let j = 0; j < column; j++)
      {
          temp.push(0);
      }
      board.push(temp);
  }
  return board;
}

export function RandomBoard(row, column)
{
  let board = [];
  for(let i = 0; i < row; i++)
  {
    let temp = [];
    for(let j = 0; j < column; j++)
    {
      Math.random() > 0.3 ? temp.push(0) : temp.push(1);
    }
    board.push(temp);
  }
  return board;
}

export function GameofLife(boardRef) {
  let row = boardRef.current.length;
  let col = boardRef.current[0].length;

  let v1 = [1, 1, 0, -1, -1, -1, 0, 1];
  let v2 = [0, 1, 1, 1, 0, -1, -1, -1];

  let temp = DeepCopy(boardRef.current);

  for (let i = 0; i < row; i++)
  {
    for (let j = 0; j < col; j++)
    {
      let liveCell = 0;
      for (let x = 0; x < v1.length; x++)
      {
        let newXCord = i + v1[x];
        let newYCord = j + v2[x];

        if (newXCord >= 0 && newYCord >= 0 && newXCord < row && newYCord < col) {
          if (temp[newXCord][newYCord] == 1)
            liveCell++;
        }
      }
      if (temp[i][j] == 0 && liveCell == 3)
        boardRef.current[i][j] = 1;
      else if (temp[i][j] == 1 && liveCell < 2 || liveCell > 3)
        boardRef.current[i][j] = 0;
    }
  }
  return;
}

export function GameofLifeDense(boardRef)
{
  let row = boardRef.current.length;
  let col = boardRef.current[0].length;
  let imageBoard = new Array(row).fill(0).map(() => new Array(col).fill(0));
  for(let i = 0; i < row; i++)
  {
    for(let j = 0; j < col; j++)
    {
      if(boardRef.current[i][j] === 1)
      {
        imageBoard[i-1][j-1]++;
        imageBoard[i-1][j]++;
        imageBoard[i-1][j+1]++;
        imageBoard[i][j-1]++;
        imageBoard[i][j+1]++;
        imageBoard[i+1][j-1]++;
        imageBoard[i+1][j]++;
        imageBoard[i+1][j+1]++;
      }
    }
  }
  for(let i = 0; i < row; i++)
  {
    for(let j = 0; j < col; j++)
    {
      if(imageBoard[i][j] === 3 || (imageBoard[i][j] === 2 && boardRef.current[i][j] === 1))
      {
        boardRef.current[i][j] = 1
      }
      else
      {
        boardRef.current[i][j] = 0;
      }
    }
  }
}

export function Uint8ClampedArrayToDense(data, width, height)
{ 
  let denseMatrix = new Array(width).fill(0).map(() => new Array(height).fill(0));
  let count = 0;
  for(let i = 0; i < data.length; i += 4)
  {
    if(data[i] === 255)
    {
      let col = Math.floor(count / width);
      let row = count % width;
      denseMatrix[col][row] = 1;
    }
    count++;
  }
  return denseMatrix;
}