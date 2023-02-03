import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import { getRandomQuote } from '../api/quoteApi';

const RandomQuote = () => {
  const [quote, setQuote] = useState({});
  const [loadingQuote, setLoadingQuote] = useState(false);
  useEffect(() => {
    setLoadingQuote(true);
    getRandomQuote()
      .then((response) => {
        setQuote(response.data);
      })
      .finally(() => {
        setLoadingQuote(false);
      });
  }, []);
  return (
    <Box sx={{ textAlign: 'center', pt: 1, pb: 1, fontSize: '14px' }}>
      {loadingQuote && <Skeleton animation='wave' variant='text' />}
      {quote.phrase && (
        <>
          <Typography variant='h7' sx={{ fontWeight: 'lighter', fontStyle: 'italic' }}>
            {`‟${quote.phrase}”`}{' '}
          </Typography>
          <Typography variant='h7' sx={{ fontWeight: 'lighter' }}>
            {' '}
            {`– ${quote.author}`}
          </Typography>
        </>
      )}
    </Box>
  );
};

export default RandomQuote;
