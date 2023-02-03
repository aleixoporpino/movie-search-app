import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import { MenuContext } from '../contexts/MenuContext';
import { ColorScheme } from '../shapes/MemberShape';

const Menu = ({ colorScheme }) => {
  const { menu, setMenu } = useContext(MenuContext);

  const activeMenu = {
    color: colorScheme.active,
    textDecoration: 'none',
    cursor: 'default',
    textDecorationThickness: 'from-font',
    fontSize: '1.5rem',
  };
  const inactiveMenu = {
    color: colorScheme.inactive,
    textDecoration: 'underline',
    cursor: 'pointer',
    textDecorationThickness: 'from-font',
    fontSize: '1.5rem',
  };

  return (
    <Box sx={{ textAlign: 'center', pb: 3 }}>
      <Link
        to='/movies'
        style={menu === 'movies' ? { ...activeMenu } : { ...inactiveMenu }}
        onClick={() => setMenu('movies')}
      >
        Movies
      </Link>{' '}
      <span style={{ fontSize: '1.5rem' }}>{' | '}</span>
      <Link
        to='/tv-shows'
        style={menu === 'tv-shows' ? { ...activeMenu } : { ...inactiveMenu }}
        onClick={() => setMenu('tv-shows')}
      >
        TV Shows
      </Link>
    </Box>
  );
};

Menu.propTypes = {
  colorScheme: PropTypes.shape(ColorScheme).isRequired,
};

export default Menu;
