import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { LoadingContext } from '../contexts/LoadingContext';
import SearchComponent from '../components/SearchComponent';
import CountryFilter from '../components/CountryFilter';
import MovieCard from '../components/MovieCard';
import CountryStreamingCard from '../components/CountryStreamingCard';
import { getCountryListSelected, getCountryStreamingFormatted } from '../utils';
import Menu from '../components/Menu';
import { MenuContext } from '../contexts/MenuContext';
import { ColorScheme } from '../shapes/MemberShape';

const MainContainer = ({ getByName, getById, searchInputLabel, colorScheme }) => {
  const { loading, setLoading } = useContext(LoadingContext);
  const { menu, setMenu } = useContext(MenuContext);
  const [selectAll, setSelectAll] = useState(true);
  const [countryListSelected, setCountryListSelected] = useState([]);
  const [name, setName] = useState('');
  const [selectedMovieName, setSelectedMovieName] = useState('');
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

  const search = (name) => {
    setShowError(false);
    setShowEmptyMessage(false);
    if (!loading && name && name.length > 0) {
      setLoading(true);
      getByName(name)
        .then((response) => {
          setLoading(false);
          setQueryResult(response.data);
          if (response.data && response.data.results.length === 0) {
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
    getById(id)
      .then((response) => {
        setStreaming(response.data);
        const formattedCountryStreaming = getCountryStreamingFormatted(response.data);
        setCountryListSelected(getCountryListSelected(formattedCountryStreaming));
        setCountryStreaming(formattedCountryStreaming);
        setCountryStreamingFiltered(formattedCountryStreaming);
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

  useEffect(() => {
    const locationPathArr = location.pathname.split('/');
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
  }, [id, location.search]);

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

  return (
    <Box sx={{ pb: 2, paddingBottom: '2.5rem' }}>
      <Menu colorScheme={colorScheme} />
      <Collapse in={showError}>
        <Alert
          severity='error'
          sx={{ mb: 3 }}
          variant='outlined'
          onClose={() => setShowError(false)}
        >
          Oops! An expected error happened, try again later.
        </Alert>
      </Collapse>
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
            queryResult.results.map((result) => (
              <Grid item xs={1} sm={3} md={3} key={result.id}>
                <MovieCard
                  movieResult={result}
                  onClickMovieTitle={(id, name) => {
                    setSelectedMovieName(name);
                    navigate(`/${menu}/${id}`);
                  }}
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
        <Box>
          <Button
            size='small'
            variant='outlined'
            onClick={() => setShowFilters(!showFilters)}
            color={colorScheme.muiColor}
            sx={{ mb: 1 }}
          >
            {showFilters ? 'Hide filters' : 'Show filters'}
          </Button>
          {showFilters && (
            <CountryFilter
              defaultSelectAll
              selectAllValue={selectAll}
              onChangeSelectAll={() => onChangeSelectAllCountries()}
              countryList={countryStreaming}
              countryListSelected={countryListSelected}
              onChangeCountry={(country) => onChangeCountry(country)}
              onClickApplyCountryFilter={() => applyCountryFilter()}
              colorScheme={colorScheme}
            />
          )}
          <br />
          <Box sx={{ pb: 2, pt: 3, textAlign: 'center' }}>
            <Link
              href={streaming.link}
              variant='h4'
              target='_blank'
              rel='noreferrer'
              color={colorScheme.active}
              sx={{
                textDecoration: 'underline',
                textDecorationThickness: 'from-font',
              }}
            >
              {selectedMovieName}
            </Link>
          </Box>
          <Grid container spacing={3} columns={{ xs: 1, sm: 8, md: 12 }}>
            {countryStreamingFiltered.map((countryFlatrate) => (
              <>
                <Grid
                  item
                  xs={1}
                  sm={3}
                  md={3}
                  key={`${countryFlatrate.country} ${countryFlatrate.streaming}`}
                >
                  <CountryStreamingCard
                    countryFlatrate={countryFlatrate}
                    colorScheme={colorScheme}
                  />
                </Grid>
              </>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

MainContainer.propTypes = {
  getByName: PropTypes.func.isRequired,
  getById: PropTypes.func.isRequired,
  searchInputLabel: PropTypes.string.isRequired,
  colorScheme: PropTypes.shape(ColorScheme).isRequired,
};

export default MainContainer;
