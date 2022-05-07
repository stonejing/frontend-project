import { Outlet, 
          Link, 
          BrowserRouter,
          Routes,
          Route, 
          Navigate } from 'react-router-dom';
import Dashboard from '../Dashboard';
import Game2048 from '../Game2048/Game2048';
import GameTicTacToe from '../GameTicTacToe/TicTacToe';
import ConwayLifeGameCanvas from '../ConwayLifeGameCanvas/ConwayLifeGameCanvas';
import BreakOutCanvas from '../BreakOutCanvas/BreakOutCanvas';
import ImageProcessing from '../ImageProcessingWebGL/ImageUpload';
import PinballCanvas from '../PinballCanvas/PinballCanvas';

const route = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/frontend-project" element={<Dashboard />}>
          <Route path="2048" element={<Game2048 />} />
          <Route path="tic-tac-toe" element={<GameTicTacToe />} />
          <Route path="conway-life-game" element={<ConwayLifeGameCanvas />} />
          <Route path="break-out" element={<BreakOutCanvas />} />
          <Route path="image-processing" element={<ImageProcessing />} />
          <Route path="pinball" element={<PinballCanvas />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default route;