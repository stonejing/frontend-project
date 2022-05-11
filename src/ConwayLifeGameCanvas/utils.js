
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