import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

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
      sx={{ width: '100%', fontWeight: 'lighter', fontSize: '11px', fontStyle: 'italic' }}
    >
      Developed by{' '}
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
      José Aleixo Filho
    </Link>
  </Box>
);

export default Footer;
