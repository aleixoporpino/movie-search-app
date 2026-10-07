import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import React from 'react';

// Shown for a title we know about but have no streaming data for, so the page
// still describes the title instead of reading as an empty "not found" page.
const NoStreamingInfo = ({ movieResult, colorScheme }) => {
  const name = movieResult.originalTitle || movieResult.title;
  const year = movieResult.releaseDate ? movieResult.releaseDate.slice(0, 4) : '';

  return (
    <Box sx={{ pb: 2, pt: 3, textAlign: 'center' }}>
      {movieResult.posterPath && (
        <Box
          component='img'
          src={`https://image.tmdb.org/t/p/w500/${movieResult.posterPath}`}
          alt={name}
          sx={{
            display: 'block',
            width: '100%',
            maxWidth: 260,
            borderRadius: 2,
            boxShadow: 3,
            mb: 2,
            mx: 'auto',
          }}
        />
      )}
      <Typography variant='h4' component='h1' color={colorScheme.active}>
        {name}
        {year && ` (${year})`}
      </Typography>
      {movieResult.overview && (
        <Typography variant='body1' sx={{ mt: 2, mx: 'auto', maxWidth: 640 }}>
          {movieResult.overview}
        </Typography>
      )}
      <Typography variant='h6' color={colorScheme.muiColor} sx={{ mt: 3 }}>
        No streaming information is available for this title yet. Check back later.
      </Typography>
    </Box>
  );
};

NoStreamingInfo.propTypes = {
  movieResult: PropTypes.shape({
    originalTitle: PropTypes.string,
    title: PropTypes.string,
    posterPath: PropTypes.string,
    releaseDate: PropTypes.string,
    overview: PropTypes.string,
  }).isRequired,
  colorScheme: PropTypes.shape({
    active: PropTypes.string,
    muiColor: PropTypes.string,
  }).isRequired,
};

export default NoStreamingInfo;
