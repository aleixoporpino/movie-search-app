import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import JustWatchImg from '../../public/justwatch.svg';
import TmdbImg from '../../public/tmdb.svg';

const Footer = () => (
  <Box
    sx={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      textAlign: 'center',
      marginRight: 'auto',
      marginLeft: 'auto',
    }}
  >
    <Typography
      variant='h7'
      sx={{
        width: '100%',
        fontWeight: 'lighter',
        fontSize: '11px',
        fontStyle: 'italic',
      }}
      style={{ marginRight: '3px' }}
    >
      {' '}
      Powered by{' '}
    </Typography>
    <Link href='https://www.justwatch.com/' data-original='https://www.justwatch.com/'>
      {' '}
      <img src={JustWatchImg} width='70px' alt='JustWatch' />
    </Link>
    <Typography
      variant='h7'
      sx={{
        width: '100%',
        fontWeight: 'lighter',
        fontSize: '11px',
        fontStyle: 'italic',
      }}
      style={{ marginRight: '3px' }}
    >
      {' '}
      and{' '}
    </Typography>
    <Link href='https://www.themoviedb.org/' data-original='https://www.themoviedb.org/'>
      {' '}
      <img src={TmdbImg} width='70px' alt='TMDB' />
    </Link>
    <Typography
      variant='h7'
      sx={{ width: '100%', fontWeight: 'lighter', fontSize: '11px', fontStyle: 'italic' }}
      style={{ marginLeft: '3px' }}
    >
      .Developed by{' '}
    </Typography>
    <Link
      variant='h7'
      sx={{
        fontWeight: 'lighter',
        fontSize: '11px',
        color: '#FFF',
        textDecoration: 'underline',
        textDecorationThickness: 'from-font',
      }}
      href='https://github.com/aleixoporpino'
      target='_blank'
      rel='noreferrer'
    >
      José Aleixo Filho.
    </Link>
  </Box>
);

export default Footer;
