import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';

const MovieCard = ({ movieResult, onClickMovieTitle, onSelectWatchlist, showWatchlistIcon }) => (
  <Card>
    <CardContent>
      <CardActionArea onClick={() => onClickMovieTitle(movieResult.id, movieResult.originalTitle)}>
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
      </CardActionArea>

      {showWatchlistIcon ? (
        <Box sx={{ textAlign: 'center' }}>
          <Tooltip title='Add to watchlist and receive notification when available according with your preferences'>
            <Checkbox
              icon={<FavoriteBorder />}
              checkedIcon={<Favorite />}
              color='error'
              onChange={onSelectWatchlist}
              checked={movieResult.watchlist}
              sx={{ '& .MuiSvgIcon-root': { fontSize: 35 }, zIndex: 30000 }}
            />
          </Tooltip>
        </Box>
      ) : (
        <></>
      )}
    </CardContent>
  </Card>
);

MovieCard.propTypes = {
  movieResult: PropTypes.object.isRequired,
  onClickMovieTitle: PropTypes.func.isRequired,
  onSelectWatchlist: PropTypes.func,
  showWatchlistIcon: PropTypes.bool,
};

MovieCard.defaultProps = {
  onSelectWatchlist: () => {},
  showWatchlistIcon: false,
};

export default MovieCard;
