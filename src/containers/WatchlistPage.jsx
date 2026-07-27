import React, { useContext, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { ArrowBackIosNew, FavoriteBorder, PersonOutline } from '@mui/icons-material';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { UserContext } from '../contexts/UserContext';
import MovieCard from '../components/MovieCard';
import { saveMovieWatchlist } from '../api/movieApi';
import { saveTvShowWatchlist } from '../api/tvShowApi';
import ErrorAlert from '../components/ErrorAlert';
import Menu from '../components/Menu';
import { MenuContext } from '../contexts/MenuContext';
import { ColorScheme } from '../shapes/MemberShape';

const REMOVE_TRANSITION_MS = 250;

const WatchlistPage = ({ colorScheme, page }) => {
  const { user, setUser } = useContext(UserContext);
  const { menu, setMenu } = useContext(MenuContext);
  const [media, setMedia] = useState([]);
  const [removingIds, setRemovingIds] = useState([]);
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();
  const label = page === 'movies' ? 'movie' : 'TV show';

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
    const updatedMedia = { ...media[index], watchlist: !media[index].watchlist };
    const saveWatchlist = page === 'movies' ? saveMovieWatchlist : saveTvShowWatchlist;

    saveWatchlist(updatedMedia)
      .then(() => {
        setRemovingIds((prevIds) => [...prevIds, updatedMedia.id]);
        setTimeout(() => {
          setMedia((prevMedia) => prevMedia.filter((it) => it.id !== updatedMedia.id));
          setRemovingIds((prevIds) => prevIds.filter((id) => id !== updatedMedia.id));
        }, REMOVE_TRANSITION_MS);

        const updatedUser = { ...user, watchlist: { ...user.watchlist } };
        if (page === 'movies') {
          updatedUser.watchlist.movies = updatedUser.watchlist.movies.filter(
            (it) => it.id !== updatedMedia.id,
          );
        } else {
          updatedUser.watchlist.tvShows = updatedUser.watchlist.tvShows.filter(
            (it) => it.id !== updatedMedia.id,
          );
        }
        setUser(updatedUser);
        // TODO: Add Success message
      })
      .catch(() => {
        // TODO: Add Error message
        setShowError(true);
      });
  };

  return (
    <Box sx={{ pb: 2, paddingBottom: '2.5rem' }}>
      <Helmet>
        <title>Your Watchlist | Search Movies and TV Shows</title>
        <meta name='robots' content='noindex' />
      </Helmet>
      <Box sx={{ pt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant='text'
          onClick={() => navigate('/')}
          size='medium'
          startIcon={<ArrowBackIosNew sx={{ fontSize: '0.8rem' }} />}
          sx={{ color: 'text.secondary' }}
        >
          Home
        </Button>
        <Button
          variant='outlined'
          color={colorScheme.muiColor}
          onClick={() => navigate('/profile')}
          size='medium'
          startIcon={<PersonOutline sx={{ fontSize: '1rem' }} />}
        >
          Profile
        </Button>
      </Box>
      <Typography variant='h4' sx={{ pb: 0.5, pt: 3 }}>
        Your Watchlist
      </Typography>
      <Typography variant='body2' color='text.secondary' sx={{ pb: 2 }}>
        {media.length > 0
          ? `${media.length} ${label}${media.length === 1 ? '' : 's'} saved`
          : `No ${label}s saved yet`}
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
      {media.length === 0 ? (
        <Box
          display='flex'
          sx={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            pt: 8,
            pb: 4,
            color: 'text.secondary',
          }}
        >
          <FavoriteBorder sx={{ fontSize: 56, mb: 2, opacity: 0.4 }} />
          <Typography variant='h6' color='text.primary' sx={{ pb: 1 }}>
            Your watchlist is empty
          </Typography>
          <Typography variant='body2' sx={{ pb: 3, maxWidth: 360 }}>
            Tap the heart on any {label} to save it here and get notified when it&apos;s available.
          </Typography>
          <Button
            variant='outlined'
            color={colorScheme.muiColor}
            onClick={() => navigate(page === 'movies' ? '/movies' : '/tv-shows')}
          >
            Browse {page === 'movies' ? 'Movies' : 'TV Shows'}
          </Button>
        </Box>
      ) : (
        <Box sx={{ pt: 3 }} display='flex' justifyContent='center'>
          <Grid container spacing={{ xs: 3 }} columns={{ xs: 1, sm: 8, md: 12 }}>
            {media.map((movie, index) => (
              <Grid
                item
                xs={1}
                sm={3}
                md={3}
                key={movie.id}
                sx={{
                  opacity: removingIds.includes(movie.id) ? 0 : 1,
                  transform: removingIds.includes(movie.id) ? 'scale(0.92)' : 'scale(1)',
                  transition: `opacity ${REMOVE_TRANSITION_MS}ms ease, transform ${REMOVE_TRANSITION_MS}ms ease`,
                }}
              >
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
      )}
    </Box>
  );
};

WatchlistPage.propTypes = {
  colorScheme: PropTypes.shape(ColorScheme).isRequired,
  page: PropTypes.string.isRequired,
};

export default WatchlistPage;
