import React, {useEffect, useState, useRef} from 'react';
import Button from '@mui/material/Button';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';

// const useStyles = makeStyles((theme) => ({
//   root: {
//     '& > *': {
//       margin: theme.spacing(1),
//     },
//   },
//   input: {
//     display: 'none',
//   },
// }));

function ImageProcessing() {
  // const classes = useStyles();
  const canvasRef = useRef(null);
  const [canvasCtx, setCanvasCtx] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const chartContainer = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);

  // useEffect(() => {
  //   if (chartContainer && chartContainer.current) {
  //     const newChartInstance = new Chartjs(chartContainer.current, chartConfig);
  //     setChartInstance(newChartInstance);
  //   }
  // }, [chartContainer]);

  // 使用 canvas 绘图
  useEffect(() => {
    if(fileUrl)
    {
      // 1. 获取canvas 元素
      // 2. 获取 2D 上下文
      // 3. 新建一个 Image 对象
      // 4. 设置 Image 的 src
      // 5. 确定 Image 加载完毕后将 Image 画到 canvas 上
      const img = new Image();
      img.src = fileUrl;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, 600, 600);
      img.onload = () => { 
        let xRate = 600 / img.width;
        let yRate = 600 / img.height;
        let setRate = xRate < yRate ? xRate : yRate;
        ctx.drawImage(img, 0, 0, img.width * setRate, img.height * setRate);
      }
    }
  })

  const processImage = (event) => {
    const imageFile = event.target.files[0];
    if(imageFile)
    {
      const imageUrl = URL.createObjectURL(imageFile);
      // ctx.drawImage(imageUrl, 0, 0);
      // draw(ctx);
      setFileUrl(imageUrl);
      // ctx.drawImage(imageUrl, 600, 600);
    }
  }

  return (
      <div>
        <input
          accept="image/*"
          // className={classes.input}
          id="contained-button-file"
          multiple
          style={{display: "none"}}
          onChange={processImage}
          type="file"
        />
        <label htmlFor="contained-button-file">
          <Button variant="contained" color="secondary" component="span">
            Upload
          </Button>
        </label>
        <p></p>
        <canvas ref={canvasRef} width="600" height="600"></canvas>
        {/* <button onClick={onButtonClick}>Randomize!</button>
        <canvas ref={chartContainer} /> */}
      </div>
    );
}

export default ImageProcessing;
