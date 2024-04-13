import React from 'react';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';

const JustWatchWidget = ({ country }) => (
  <Box sx={{ pt: 1, textAlign: 'center' }}>
    <Typography
      variant='h7'
      sx={{ width: '100%', fontWeight: 'lighter', fontStyle: 'italic', fontSize: 11 }}
      style={{ marginRight: '3px' }}
    >
      Powered by{' '}
    </Typography>
    <Link
      variant='h7'
      sx={{
        fontWeight: 'lighter',
        color: '#FFF',
        textDecoration: 'underline',
        textDecorationThickness: 'from-font',
      }}
      data-original='https://www.justwatch.com'
      href={`https://www.justwatch.com/${country}`}
      target='_blank'
      rel='noreferrer'
    >
      <img
        alt='JustWatch'
        height='10px'
        width='80px'
        src='https://widget.justwatch.com/assets/JW_logo_color_10px.svg'
      />
    </Link>
  </Box>
);

export default JustWatchWidget;
