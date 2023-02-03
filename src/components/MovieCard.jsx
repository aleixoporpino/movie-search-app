import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const MovieCard = ({ movieResult, onClickMovieTitle }) => (
  <Card>
    <CardActionArea onClick={() => onClickMovieTitle(movieResult.id, movieResult.originalTitle)}>
      <CardContent>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <img
            width='200px'
            src={`https://image.tmdb.org/t/p/w500/${movieResult.posterPath}`}
            alt={movieResult.originalTitle}
          />
        </Box>
        <Typography gutterBottom variant='h5' component='div'>
          {movieResult.originalTitle}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {movieResult.overview}
        </Typography>
      </CardContent>
    </CardActionArea>
  </Card>
);

MovieCard.propTypes = {
  movieResult: PropTypes.object.isRequired,
  onClickMovieTitle: PropTypes.func.isRequired,
};

export default MovieCard;
