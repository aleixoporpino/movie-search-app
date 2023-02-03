import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ pt: 3 }}>
      <Typography variant='h4' color='#ffa726' sx={{ pb: 1 }}>
        Page Not found
      </Typography>
      <div style={{ width: '100%', height: '0', paddingBottom: '50%', position: 'relative' }}>
        <iframe
          src='https://giphy.com/embed/6uGhT1O4sxpi8'
          width='100%'
          height='100%'
          style={{ position: 'absolute' }}
          frameBorder='0'
          className='giphy-embed'
          allowFullScreen
          title='awkward-pulp-fiction-john-travolta'
        />
      </div>
      <Button variant='outlined' color='warning' sx={{ mt: 3 }} onClick={() => navigate('/')}>
        Go home
      </Button>
    </Box>
  );
};

export default NotFound;
