import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { LoadingContext } from '../contexts/LoadingContext';
import SearchComponent from '../components/SearchComponent';
import MovieCard from '../components/MovieCard';
import {
  getCountryListSelected,
  getCountryStreamingFiltered,
  getCountryStreamingFormatted,
} from '../utils';
import Menu from '../components/Menu';
import { MenuContext } from '../contexts/MenuContext';
import { ColorScheme } from '../shapes/MemberShape';
import { UserContext } from '../contexts/UserContext';
import { API_URL } from '../../app.properties';
import MovieStreamingDetails from '../components/MovieStreamingDetails';
import ErrorAlert from '../components/ErrorAlert';

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
  const [countryStreaming, setCountryStreaming] = useState([]);
  const [countryStreamingFiltered, setCountryStreamingFiltered] = useState([]);
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
      setCountryStreaming([]);
      setCountryStreamingFiltered([]);
    }
  };

  const searchStreaming = (id) => {
    setShowError(false);
    setLoading(true);
    getProvidersById(id)
      .then((response) => {
        setStreaming(response.data);
        const countriesStreaming = getCountryStreamingFormatted(response.data);
        const selectedCountries = getCountryListSelected(countriesStreaming, user);
        setCountryListSelected(selectedCountries);
        setCountryStreaming(countriesStreaming);
        const filteredCountryStreaming = getCountryStreamingFiltered(
          countriesStreaming,
          selectedCountries,
        );
        setCountryStreamingFiltered(filteredCountryStreaming);
        if (filteredCountryStreaming.length !== Object.keys(selectedCountries).length) {
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
    setName('');
    setQueryResult([]);
  };

  const applyCountryFilter = () => {
    setShowError(false);
    const newFilteredArray = [];
    countryStreaming.forEach((item) => {
      if (countryListSelected[item.country]) {
        newFilteredArray.push(item);
      }
    });
    setCountryStreamingFiltered(newFilteredArray);
  };

  const onChangeCountry = (country) => {
    countryListSelected[country] = !countryListSelected[country];
    setCountryListSelected(countryListSelected);
    applyCountryFilter();
  };

  const onChangeSelectAllCountries = () => {
    setSelectAll(!selectAll);

    const countryList = {};
    countryStreaming.forEach((item) => {
      countryList[item.country] = !selectAll;
    });

    setCountryListSelected(countryList);
    applyCountryFilter();
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

  return (
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

      {streaming && countryStreamingFiltered.length > 0 && (
        <MovieStreamingDetails
          onClickShowFilters={() => setShowFilters(!showFilters)}
          showFilters={showFilters}
          selectAll={selectAll}
          onChangeSelectAllCountries={() => onChangeSelectAllCountries()}
          countryStreaming={countryStreaming}
          countryListSelected={countryListSelected}
          onClickChangeCountry={(country) => onChangeCountry(country)}
          onClickApplyCountryFilter={() => applyCountryFilter()}
          streaming={streaming}
          countryStreamingFiltered={countryStreamingFiltered}
          colorScheme={colorScheme}
          showWatchlistIcon={!!user && !!user.email}
          movieResult={selectedMovie}
          onSelectWatchlist={() => onSelectWatchlistOnMovieStreamingDetails()}
        />
      )}
    </Box>
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
