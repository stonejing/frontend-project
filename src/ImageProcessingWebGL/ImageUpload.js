import React, {useEffect, useState, useRef} from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
//按需导入
import echarts from 'echarts/lib/echarts'
//导入柱形图
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/markPoint'
import ReactEcharts from 'echarts-for-react'
// import Chartjs from "chart.js";

const randomInt = () => Math.floor(Math.random() * (10 - 1 + 1)) + 1;
let array = new Array();
for(let i = 0; i < 256; i++)
{
  array[i] = i;
}

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: 'none',
  },
}));

const chartConfig = {
  type: 'bar',
  data: {

  },
  options: {

  }
};

const option = {
      title: {
          text: '用户订单'
      },
      tooltip:{
          trigger: 'axis'
      },
      xAxis: {
          data: array
      },
      yAxis: {
          type: 'value'
      },
      series : [
          {
              name:'订单量',
              type:'bar',
              barWidth: '50%',
              data:[1000, 1500, 2000, 3000, 2500, 1800, 1200]
          }
      ]
  };

function App() {
  const classes = useStyles();
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

  // const updateDataset = (datasetIndex, newData) => {
  //   chartInstance.data.datasets[datasetIndex].data = newData;
  //   chartInstance.update();
  // };

  // const onButtonClick = () => {
  //   const data = [
  //     randomInt(),
  //     randomInt(),
  //     randomInt(),
  //     randomInt(),
  //     randomInt(),
  //     randomInt()
  //   ];
  //   updateDataset(0, data);
  // };

  return (
      <div>
        <input
          accept="image/*"
          className={classes.input}
          id="contained-button-file"
          multiple
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
        <ReactEcharts option={option}/>
      </div>
    );
}

export default App;
