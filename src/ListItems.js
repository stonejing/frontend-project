import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ImageIcon from '@mui/icons-material/Image';
import SportsBaseballIcon from '@mui/icons-material/SportsBaseball';
import AdjustOutlinedIcon from '@mui/icons-material/AdjustOutlined';
import { Link } from 'react-router-dom';

export const mainListItems = (
  <React.Fragment>
    <Link to="/frontend-project">
      <ListItemButton>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
    </Link>

    <Link to="2048"> 
      <ListItemButton>
        <ListItemIcon>
          <ShoppingCartIcon />
        </ListItemIcon>
        <ListItemText primary="2048" />
      </ListItemButton>
    </Link>

    <Link to="tic-tac-toe">
      <ListItemButton>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="TicTacToe" />
      </ListItemButton>
    </Link>

    <Link to="conway-life-game">
      <ListItemButton>
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
          <ListItemText primary="Conway's life game" />
      </ListItemButton>
    </Link>

    <Link to="break-out">
      <ListItemButton>
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary="Break Out" />
      </ListItemButton>
    </Link>

    <Link to="image-processing">
      <ListItemButton>
        <ListItemIcon>
          <ImageIcon />
        </ListItemIcon>
        <ListItemText primary="Image Processing" />
      </ListItemButton>
    </Link>

    <Link to="pinball">
      <ListItemButton>
        <ListItemIcon>
          <SportsBaseballIcon />
        </ListItemIcon>
        <ListItemText primary="Pinball" />
      </ListItemButton>
    </Link>

    <Link to="/retroword-frontend">
      <ListItemButton>
        <ListItemIcon>
          <AdjustOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="RetroWord" />
      </ListItemButton>
    </Link>

  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
    <ListSubheader component="div" inset>
      Saved reports
    </ListSubheader>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItemButton>
  </React.Fragment>
);