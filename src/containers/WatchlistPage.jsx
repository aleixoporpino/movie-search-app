import React, { useContext, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { UserContext } from '../contexts/UserContext';
import MovieCard from '../components/MovieCard';
import { saveMovieWatchlist } from '../api/movieApi';
import ErrorAlert from '../components/ErrorAlert';
import Menu from '../components/Menu';
import { MenuContext } from '../contexts/MenuContext';
import { ColorScheme } from '../shapes/MemberShape';

const WatchlistPage = ({ colorScheme, page }) => {
  const { user } = useContext(UserContext);
  const { menu, setMenu } = useContext(MenuContext);
  const [media, setMedia] = useState([]);
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (page === 'movies') {
      if (user && user.watchlist && user.watchlist.movies) {
        setMedia(user.watchlist.movies);
      }
    } else if (page === 'tv-shows') {
      if (user && user.watchlist && user.watchlist.tvShows) {
        setMedia(user.watchlist.tvShows);
      }
    }

    if (page) {
      setMenu(page);
    }
  }, [menu, page, setMenu, user]);

  const onSelectWatchlist = (index) => {
    const updatedMovies = [...media];
    updatedMovies[index] = {
      ...updatedMovies[index],
      watchlist: !updatedMovies[index].watchlist,
    };
    setMedia(updatedMovies);
    saveMovieWatchlist(updatedMovies[index])
      .then(() => {
        // TODO: Add Success message
      })
      .catch(() => {
        // TODO: Add Error message
        setShowError(true);
      });
  };

  return (
    <Box sx={{ pb: 2, paddingBottom: '2.5rem' }}>
      <Typography variant='h4' sx={{ pb: 2, pt: 6 }}>
        Your Watchlist
      </Typography>
      <Menu
        user={user}
        linkMovies='/watchlist/movies'
        linkTvShows='/watchlist/tv-shows'
        handleWatchlist={() => navigate('/watchlist')}
        handleHome={() => navigate('/')}
        handleLogin={() => {}}
        handleProfile={() => navigate('/profile')}
        handleLogout={() => navigate('/')}
        colorScheme={colorScheme}
      />
      <ErrorAlert showError={showError} onClose={() => setShowError(false)} />
      <Box sx={{ pt: 3 }} display='flex' justifyContent='center'>
        <Grid container spacing={{ xs: 3 }} columns={{ xs: 1, sm: 8, md: 12 }}>
          {media &&
            media.length > 0 &&
            media.map((movie, index) => (
              <Grid item xs={1} sm={3} md={3} key={movie.id}>
                <MovieCard
                  movieResult={movie}
                  onClickMovieTitle={(id) => {
                    navigate(`/movies/${id}`);
                  }}
                  onSelectWatchlist={() => onSelectWatchlist(index)}
                  showWatchlistIcon={!!user && !!user.email}
                />
              </Grid>
            ))}
        </Grid>
      </Box>
    </Box>
  );
};

WatchlistPage.propTypes = {
  colorScheme: PropTypes.shape(ColorScheme).isRequired,
  page: PropTypes.string.isRequired,
};

export default WatchlistPage;
