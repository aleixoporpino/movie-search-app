import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { LoadingContext } from '../contexts/LoadingContext';
import SearchComponent from '../components/SearchComponent';
import MovieCard from '../components/MovieCard';
import {
  getCountryListSelected,
  getCountryStreamingFiltered,
  getCountryProvidersFormatted,
} from '../utils';
import Menu from '../components/Menu';
import { MenuContext } from '../contexts/MenuContext';
import { ColorScheme } from '../shapes/MemberShape';
import { UserContext } from '../contexts/UserContext';
import { API_URL } from '../../app.properties';
import MovieStreamingDetails from '../components/MovieStreamingDetails';
import ErrorAlert from '../components/ErrorAlert';
import WebSocketComponent from '../components/WebSocketComponent';
import RandomQuote from '../components/RandomQuote';

const MainContainer = ({
  page,
  getByName,
  getProvidersById,
  searchInputLabel,
  colorScheme,
  getById,
  saveWatchlist,
  applyWatchlist,
}) => {
  const { user, setUser } = useContext(UserContext);
  const { loading, setLoading } = useContext(LoadingContext);
  const { menu, setMenu } = useContext(MenuContext);
  const [selectAll, setSelectAll] = useState(true);
  const [countryListSelected, setCountryListSelected] = useState([]);
  const [name, setName] = useState('');
  const [selectedMovie, setSelectedMovie] = useState({});
  const [queryResult, setQueryResult] = useState([]);
  const [streaming, setStreaming] = useState([]);
  const [countryProviders, setCountryProviders] = useState([]);
  const [countryProvidersFiltered, setCountryProvidersFiltered] = useState([]);
  const [showEmptyMessage, setShowEmptyMessage] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const locationPathArr = location.pathname.split('/');

    if (location.search && location.search.includes('token=')) {
      const token = location.search.split('token=')[1];
      localStorage.setItem('token', token);
      window.location.href = '/movies';
      navigate('/movies');
      return;
    }

    loadSelectedMovie();

    if (
      locationPathArr.length > 1 &&
      (locationPathArr[1] === 'tv-shows' || locationPathArr[1] === 'movies')
    ) {
      setMenu(locationPathArr[1]);
    } else {
      setMenu('movies');
    }

    if (location && location.search) {
      const locationSearchArr = location.search.split('?name=');
      if (locationSearchArr.length > 1) {
        const nameDecoded = decodeURIComponent(locationSearchArr[1]);
        setName(nameDecoded);
        search(nameDecoded);
      }
    }
    const reg = new RegExp('^[0-9]+$');
    if (reg.test(id)) {
      searchStreaming(id);
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [id, location.search, user]);

  const loadSelectedMovie = () => {
    if (id && !selectedMovie.id) {
      setLoading(true);
      getById(id)
        .then((res) => {
          setSelectedMovie(res.data);
          setLoading(false);
        })
        .catch(() => {
          setShowError(true);
          setLoading(false);
        });
    }
  };

  const search = (name) => {
    setShowError(false);
    setShowEmptyMessage(false);
    if (!loading && name && name.length > 0) {
      setLoading(true);
      getByName(name)
        .then((response) => {
          setLoading(false);
          setQueryResult(applyWatchlist(response.data));
          if (!response.data || !response.data.results || response.data.results.length === 0) {
            setShowEmptyMessage(true);
          }
        })
        .catch(() => {
          setShowError(true);
          setLoading(false);
        });
      setStreaming([]);
      setCountryProviders([]);
      setCountryProvidersFiltered([]);
    }
  };

  const searchStreaming = (id) => {
    setShowError(false);
    setLoading(true);
    getProvidersById(id)
      .then((response) => {
        setStreaming(response.data);
        const countriesProviders = getCountryProvidersFormatted(response.data);
        const selectedCountries = getCountryListSelected(countriesProviders, user);
        setCountryListSelected(selectedCountries);
        setCountryProviders(countriesProviders);
        const filteredCountryProviders = getCountryStreamingFiltered(
          countriesProviders,
          selectedCountries,
        );
        setCountryProvidersFiltered(filteredCountryProviders);
        if (filteredCountryProviders.length !== Object.keys(selectedCountries).length) {
          setSelectAll(false);
        }

        setLoading(false);
        if (response.data && Object.entries(response.data.results).length === 0) {
          setShowEmptyMessage(true);
        }
      })
      .catch(() => {
        setShowError(true);
        setLoading(false);
      });
    setQueryResult([]);
  };

  const applyCountryFilter = (selectedCountries = countryListSelected) => {
    setShowError(false);
    setCountryProvidersFiltered(getCountryStreamingFiltered(countryProviders, selectedCountries));
  };

  const onChangeCountry = (country) => {
    const updatedCountryListSelected = {
      ...countryListSelected,
      [country]: !countryListSelected[country],
    };
    setCountryListSelected(updatedCountryListSelected);
    applyCountryFilter(updatedCountryListSelected);
  };

  const onChangeSelectAllCountries = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    const countryList = {};
    countryProviders.forEach((item) => {
      countryList[item.country] = newSelectAll;
    });

    setCountryListSelected(countryList);
    applyCountryFilter(countryList);
  };

  const handleLogin = () => {
    // TODO: use some sort of env here
    const apiUrl = `${API_URL}auth/google?token=${localStorage.getItem('token')}`;
    window.location.href = apiUrl || `${window.location.origin}/${apiUrl}`;
  };

  const handleLogout = () => {
    localStorage.setItem('token', '');
    setUser({});
  };

  const onSelectWatchlist = (index) => {
    const updatedResults = [...queryResult.results];
    updatedResults[index] = {
      ...updatedResults[index],
      watchlist: !updatedResults[index].watchlist,
    };

    const updatedUser = { ...user };

    setQueryResult({ ...queryResult, results: updatedResults });
    saveWatchlist(updatedResults[index])
      .then(() => {
        const media = updatedResults[index];
        if (media.watchlist) {
          if (page === 'Movies') {
            updatedUser.watchlist.movies.push(media);
          } else if (page === 'TV Shows') {
            updatedUser.watchlist.tvShows.push(media);
          }
        } else if (page === 'Movies') {
          updatedUser.watchlist.movies = updatedUser.watchlist.movies.filter(
            (it) => it.id !== media.id,
          );
        } else if (page === 'TV Shows') {
          updatedUser.watchlist.tvShows = updatedUser.watchlist.tvShows.filter(
            (it) => it.id !== media.id,
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

  const onSelectWatchlistOnMovieStreamingDetails = () => {
    const updatedSelectedMovie = { ...selectedMovie };
    updatedSelectedMovie.watchlist = !selectedMovie.watchlist;
    setSelectedMovie(updatedSelectedMovie);

    if (user && user.watchlist && user.watchlist.movies) {
      const updatedUserMovies = [...user.watchlist.movies];
      updatedUserMovies.forEach((movie, i) => {
        if (Number(movie.id) === Number(updatedSelectedMovie.id)) {
          updatedUserMovies[i].watchlist = updatedSelectedMovie.watchlist;
        }
      });
      const updatedUser = { ...user };
      updatedUser.watchlist.movies = updatedUserMovies;
      saveWatchlist(updatedSelectedMovie)
        .then(() => {
          setUser(updatedUser);
        })
        .catch(() => {
          // TODO: Add Error message
          setShowError(true);
        });
    }
  };

  const canonicalUrl = `${window.location.origin}${location.pathname}`;
  const singular = page === 'Movies' ? 'movie' : 'TV show';
  const pageTitle =
    id && selectedMovie.id
      ? `${selectedMovie.originalTitle} - Where to watch | Search Movies and TV Shows`
      : `${page} - Search and find where to watch | Search Movies and TV Shows`;
  const pageDescription =
    id && selectedMovie.id
      ? (selectedMovie.overview && selectedMovie.overview.slice(0, 160)) ||
        `Find out where to stream ${selectedMovie.originalTitle}, including which countries it's available in.`
      : `Search for ${singular}s and find out which streaming service has them, from Netflix to Apple TV to Amazon Prime, and which countries they're streaming in.`;
  const posterUrl =
    id && selectedMovie.id && selectedMovie.posterPath
      ? `https://image.tmdb.org/t/p/w500/${selectedMovie.posterPath}`
      : undefined;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name='description' content={pageDescription} />
        <link rel='canonical' href={canonicalUrl} />
        <meta property='og:type' content={id && selectedMovie.id ? 'video.movie' : 'website'} />
        <meta property='og:title' content={pageTitle} />
        <meta property='og:description' content={pageDescription} />
        <meta property='og:url' content={canonicalUrl} />
        {posterUrl && <meta property='og:image' content={posterUrl} />}
        <meta name='twitter:card' content={posterUrl ? 'summary_large_image' : 'summary'} />
        <meta name='twitter:title' content={pageTitle} />
        <meta name='twitter:description' content={pageDescription} />
        {posterUrl && <meta name='twitter:image' content={posterUrl} />}
        {id && selectedMovie.id && (
          <script type='application/ld+json'>
            {JSON.stringify({
              '@context': 'https://schema.org',
              '@type': page === 'Movies' ? 'Movie' : 'TVSeries',
              name: selectedMovie.originalTitle,
              description: selectedMovie.overview,
              image: posterUrl,
              aggregateRating: selectedMovie.voteAverage
                ? {
                    '@type': 'AggregateRating',
                    ratingValue: selectedMovie.voteAverage,
                    ratingCount: selectedMovie.voteCount || 1,
                    bestRating: 10,
                    worstRating: 0,
                  }
                : undefined,
            })}
          </script>
        )}
      </Helmet>
      <RandomQuote />
      <Box sx={{ pb: 2, paddingBottom: '2.5rem' }}>
        <Menu
          colorScheme={colorScheme}
          user={user}
          handleHome={() => navigate('/')}
          handleLogin={handleLogin}
          handleProfile={() => navigate('/profile')}
          handleWatchlist={() => navigate('/watchlist')}
          handleLogout={handleLogout}
        />
        <ErrorAlert showError={showError} onClose={() => setShowError(false)} />
        <SearchComponent
          onSearch={() => navigate(`/${menu}?name=${name}`)}
          setValue={(value) => setName(value)}
          value={name}
          loading={loading}
          label={searchInputLabel}
          colorScheme={colorScheme}
        />

        <Box sx={{ pt: 3 }} display='flex' justifyContent='center'>
          <Grid container spacing={{ xs: 3 }} columns={{ xs: 1, sm: 8, md: 12 }}>
            {queryResult &&
              queryResult.results &&
              queryResult.results.map((result, index) => (
                <Grid item xs={1} sm={3} md={3} key={result.id}>
                  <MovieCard
                    movieResult={result}
                    onClickMovieTitle={(id) => {
                      setSelectedMovie(result);
                      navigate(`/${menu}/${id}`);
                    }}
                    onSelectWatchlist={() => onSelectWatchlist(index)}
                    showWatchlistIcon={!!user && !!user.email}
                  />
                </Grid>
              ))}
          </Grid>
        </Box>
        {showEmptyMessage && (
          <Typography variant='h6' color={colorScheme.muiColor}>
            Nothing was found 😞.
          </Typography>
        )}

        {streaming && countryProviders.length > 0 && (
          <MovieStreamingDetails
            onClickShowFilters={() => setShowFilters(!showFilters)}
            showFilters={showFilters}
            selectAll={selectAll}
            onChangeSelectAllCountries={() => onChangeSelectAllCountries()}
            countryProviders={countryProviders}
            countryListSelected={countryListSelected}
            onClickChangeCountry={(country) => onChangeCountry(country)}
            onClickApplyCountryFilter={() => applyCountryFilter()}
            streaming={streaming}
            countryProvidersFiltered={countryProvidersFiltered}
            colorScheme={colorScheme}
            showWatchlistIcon={!!user && !!user.email}
            movieResult={selectedMovie}
            onSelectWatchlist={() => onSelectWatchlistOnMovieStreamingDetails()}
          />
        )}
        <WebSocketComponent page={location.pathname} />
      </Box>
    </>
  );
};

MainContainer.propTypes = {
  page: PropTypes.string.isRequired,
  getByName: PropTypes.func.isRequired,
  getProvidersById: PropTypes.func.isRequired,
  searchInputLabel: PropTypes.string.isRequired,
  colorScheme: PropTypes.shape(ColorScheme).isRequired,
  getById: PropTypes.func.isRequired,
  saveWatchlist: PropTypes.func.isRequired,
  applyWatchlist: PropTypes.func.isRequired,
};

export default MainContainer;
