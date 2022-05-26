import React, { useEffect, useState, useRef } from 'react';
import "./Game2048.css";

const colors = {
  2: "#D2AADA",
  4: "#AD7FB9",
  8: "#8F4C9F",
  16: "#693476",
  32: "#E387AD",
  64: "#D16B9B",
  128: "#9D437A",
  256: "#5E1C47",
  512: "#E0727F",
  1024: "#D05668",
  2048: "#CB0030",
  4096: "#900029",
  8192: "#5DA6C2",
  16384: "#4187AB",
  32768: "#286D89",
  65536: "#135A79",
  131072: "#0B2330"
};

const keyCodes = {
  37: "left",
  38: "up",
  39: "right",
  40: "down",
  72: "left",
  75: "up",
  76: "right",
  74: "down"
};

// performance, this is the fastest version
function Matrix(rows, cols) {
  let matrix = [];
  for (let i = 0; i < rows; i++) {
    matrix.push([]);
    for (let j = 0; j < cols; j++) {
      matrix[i][j] = 0;
    }
  }
  return matrix;
}

function DeepCopy(items) {
  return items.map(item => Array.isArray(item) ? DeepCopy(item) : item);
}

let tileStyle = {
  height: "0%",
  width: "0%",
  top: "45%",
  left: "45%"
}

function Tile(props) {

  const [ss, setSs] = useState(tileStyle);
  const offset = useRef(50);
  const dimension = useRef(0);

  const offset_2 = useRef(0);
  const dimension_2 = useRef(100);
  const way = useRef(1);

  let interval;

  function changeStyle() {
    if (dimension.current === 110 && offset.current === -5) {
      dimension.current = 0;
      offset.current = 50;
      clearInterval(interval);
      return;
    }
    let jasper = {};
    jasper.background = colors[props.value];
    jasper.height = dimension.current + "%";
    jasper.width = dimension.current + "%";
    jasper.top = offset.current + "%";
    jasper.left = offset.current + "%";
    offset.current -= 5;
    dimension.current += 10;
    setSs(jasper);
  }

  useEffect(() => {
    if (props.value !== 0 && props.anime === 2) {
      interval = setInterval(() => {
        changeStyle();
      }, 15);
      return () => {
        clearInterval(interval);
      }
    }
    if (props.value !== 0 && props.anime === 1) {
      interval = setInterval(() => {
        if (dimension_2.current === 110) way.current = -1;

        dimension_2.current += way.current * 2;
        offset_2.current -= way.current;

        if (dimension_2.current === 100) {
          way.current = 1;
          clearInterval(interval);
          return;
        }

        let jasper = {};
        jasper.background = colors[props.value];
        jasper.height = dimension_2.current + "%";
        jasper.width = dimension_2.current + "%";
        jasper.top = offset_2.current + "%";
        jasper.left = offset_2.current + "%";
        setSs(jasper);

      }, 15);
      return () => {
        clearInterval(interval);
      }
    }
  });

  if (props.value !== 0) {
    if (props.anime === 2) {
      return (
        <div className='tile'>
          <span className='tile-span' style={ss}> {dimension.current === 110 && props.value} </span>
        </div>
      )
    }
    else if (props.anime === 1) {
      return (
        <div className='tile'>
          <span className='tile-span-new' style={ss}> {props.value} </span>
        </div>
      )
    }
    else {
      return (
        <div className='tile'>
          <span className='tile-span-new' style={{ background: colors[props.value] }}> {props.value} </span>
        </div>
      )
    }
  }
  else {
    return (
      <div className='tile'>
        <span className='null'></span>
      </div>
    )
  }
}

function Board(props) {

  let board = [];
  const { tiles, anime } = props;

  const getBoard = () => {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        board.push(<Tile key={4*i+j} value={tiles[i][j]} anime={anime[i][j]}/>);
      }
    }
    return board;
  }

  return (
    <div className='tiles'>
      { getBoard() }
    </div>
  );
}

function Game2048() {
  const [matrix, setMatrix] = useState(Matrix(4, 4));
  const [animation, setAnimation] = useState(Matrix(4, 4));
  const [ended, setEnded] = useState(false);
  const [paused, setPaused] = useState(false);
  const [finalNumber, setFinalNumber] = useState(0);

  let newMatrix = matrix;
  let newAnimation = Matrix(4, 4);

  const goal = 2048;
  const numStartTiles = 2;    

  function withinBounds(x, y) {
    return (x >= 0 && y >= 0 && x < 4 && y < 4);
  }

  function checkResult() {
    let matrixFull = true;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if(newMatrix[i][j] === 0)
          return;
        if (newMatrix[i][j] === goal) {
          setEnded(true);
        }
      }
    }
    if (matrixFull) {
      let temp;
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if ((withinBounds(i, j + 1) && newMatrix[i][j] === newMatrix[i][j + 1]) ||
            (withinBounds(i + 1, j) && newMatrix[i][j] === newMatrix[i + 1][j])) {
            return;
          }
          temp = (newMatrix[i][j] > finalNumber) ? newMatrix[i][j] : finalNumber;
        }
      }
      setFinalNumber(temp);
      setEnded(true);
    }
  }

  function addRandomTile() {
    if (ended || paused) return;
    let tileNumber = Math.random() > 0.4 ? 2 : 4;
    let randomIndex, rowIndex, colIndex;

    while (true) {
      randomIndex = Math.floor(Math.random() * 4 * 4);
      rowIndex = Math.floor(randomIndex / 4);
      colIndex = randomIndex % 4;
      if (newMatrix[rowIndex][colIndex] === 0) break;
    }
    newMatrix[rowIndex][colIndex] = tileNumber;
    newAnimation[rowIndex][colIndex] = 2;
  }

  function start() {
    newMatrix = Matrix(4, 4);
    newAnimation = Matrix(4, 4);
    for (let i = 0; i < numStartTiles; i++) {
        let tileNumber = Math.random() > 0.3 ? 2 : 4;
        let randomIndex, rowIndex, colIndex;

        while (true) {
            randomIndex = Math.floor(Math.random() * 4 * 4);
            rowIndex = Math.floor(randomIndex / 4);
            colIndex = randomIndex % 4;
            if (newMatrix[rowIndex][colIndex] === 0) break;
        }
        newMatrix[rowIndex][colIndex] = tileNumber;
        newAnimation[rowIndex][colIndex] = 2;
    }
    setMatrix(newMatrix);
    setAnimation(newAnimation);
  }

  function clear() {
    setEnded(false);
    setPaused(false);
  }

  function move(direction) {
    if (ended || paused) return;
    let madeAMove = false;
    let didMerge = Matrix(4, 4);

    function next(currIndex) {
      let vect = {
        x: currIndex.x,
        y: currIndex.y
      };
      switch (direction) {
        case "up":
          vect.x = currIndex.x - 1;
          break;
        case "down":
          vect.x = currIndex.x + 1;
          break;
        case "left":
          vect.y = currIndex.y - 1;
          break;
        case "right":
          vect.y = currIndex.y + 1;
          break;
        default:
          break;
      }
      return vect;
    }

    function getMatrixValue(indexVect) {
      if (!withinBounds(indexVect.x, indexVect.y)) {
        return undefined;
      }
      return matrix[indexVect.x][indexVect.y];
    }

    function updateMatrixValue(i, j) {
      let dest = { x: i, y: j };
      let nextDest, shouldChange = false, value = matrix[i][j];
      if (matrix[i][j] === 0) return;
      while (getMatrixValue(next(dest)) === 0) {
        dest = next(dest);
        madeAMove = true;
        shouldChange = true;
      }

      nextDest = next(dest);
      if (getMatrixValue(nextDest) === value && !didMerge[nextDest.x][nextDest.y]) {
        dest = nextDest;
        didMerge[nextDest.x][nextDest.y] = true;
        madeAMove = true;
        shouldChange = true;
        newAnimation[nextDest.x][nextDest.y] = 1;
      }

      if (shouldChange) {
        newMatrix[i][j] = 0;
        newMatrix[dest.x][dest.y] += value;
      }
    }

    switch(direction)
    {
      case "up":
      case "left":
      {
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
            updateMatrixValue(i, j);
          }
        }
        break;
      }
      case "down":
      case "right":
      {
        for (let i = 3; i >= 0; i--) {
          for (let j = 3; j >= 0; j--) {
            updateMatrixValue(i, j);
          }
        }
        break;
      }
      default:
        break;
    }

    if (madeAMove) {
      addRandomTile();
      checkResult();
      setAnimation(newAnimation);
      setMatrix(newMatrix);
    }
  }

  const handleKeyDown = (e) => {
    e.preventDefault();
    move(keyCodes[e.keyCode]);
  };

  const handleRestart = () => {
    clear();
    start();
  }


  useEffect(() => {
    start();
  }, [])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    }
  }, [handleKeyDown]);

  return (
    <div className='game-2048'>
      <div className='board-2048'>
        <Board tiles={matrix} anime={animation} />
        <button onClick={handleRestart}>{ended ? "you lose" : "click me"}</button>
        <div id="result-box">
          <div id="result-background"></div>
          <div id="result-message"></div>
          <div id="result-tile-container">
            <div id="result-tile"></div>
          </div>
          <button id="keep-going-button" className="result-button">Keep Going</button>
          <button id="try-again-button" className="result-button">Try Again</button>
        </div>
      </div>
      <div id="message-box"></div>
      <div id="menu">
        <i id="restart" className="fa fa-refresh" aria-hidden="true"></i>
      </div>
      {/* <div className="popOver">
        p
      </div> */}
    </div>
  )
}

export default Game2048;