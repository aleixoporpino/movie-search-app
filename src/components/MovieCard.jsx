import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';

const MovieCard = ({ movieResult, onClickMovieTitle, onSelectWatchlist, showWatchlistIcon }) => (
  <Card
    sx={{
      transition: 'transform .25s ease',
      '&:hover': { transform: 'translateY(-4px)' },
    }}
  >
    <CardActionArea onClick={() => onClickMovieTitle(movieResult.id, movieResult.originalTitle)}>
      <Box
        sx={{
          position: 'relative',
          aspectRatio: '2 / 3',
          overflow: 'hidden',
          bgcolor: 'background.default',
        }}
      >
        <Box
          component='img'
          src={`https://image.tmdb.org/t/p/w500/${movieResult.posterPath}`}
          alt={movieResult.originalTitle}
          sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, transparent 55%, rgba(12,10,8,0.88) 100%)',
          }}
        />
        <Typography
          variant='h6'
          sx={{
            position: 'absolute',
            left: 12,
            right: 12,
            bottom: 10,
            color: '#f1e9dc',
            fontSize: '1.05rem',
            lineHeight: 1.25,
          }}
        >
          {movieResult.originalTitle}
        </Typography>
      </Box>
    </CardActionArea>

    <Box sx={{ p: 2, pt: 1.5 }}>
      <Typography variant='body2' color='text.secondary'>
        {movieResult.overview}
      </Typography>

      {showWatchlistIcon ? (
        <Box sx={{ textAlign: 'center', mt: 1 }}>
          <Tooltip title='Add to watchlist and receive notification when available according with your preferences'>
            <Checkbox
              icon={<FavoriteBorder />}
              checkedIcon={<Favorite />}
              color='error'
              onChange={onSelectWatchlist}
              checked={movieResult.watchlist}
              sx={{ '& .MuiSvgIcon-root': { fontSize: 35 } }}
            />
          </Tooltip>
        </Box>
      ) : (
        <></>
      )}
    </Box>
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
