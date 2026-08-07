import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import CountryStreamingCard from './CountryStreamingCard';
import CountryFilter from './CountryFilter';
import ProviderFilter from './ProviderFilter';
import { ColorScheme } from '../shapes/MemberShape';
import UserScore from './UserScore';
import { MovieResultShape } from '../shapes/MovieResultShape';

const MovieStreamingDetails = ({
  onClickShowCountryFilters,
  showCountryFilters,
  selectAll,
  onChangeSelectAllCountries,
  countryProviders,
  countryListSelected,
  onClickChangeCountry,
  onClickApplyCountryFilter,
  onClickShowProviderFilters,
  showProviderFilters,
  selectAllProviders,
  onChangeSelectAllProviders,
  providersList,
  providerListSelected,
  onClickChangeProvider,
  streaming,
  countryProvidersFiltered,
  colorScheme,
  showWatchlistIcon,
  onSelectWatchlist,
  movieResult,
}) => {
  const getName = () => {
    if (!movieResult) {
      return '';
    }

    if (movieResult.title) {
      return movieResult.title;
    }

    if (movieResult.originalTitle) {
      return movieResult.originalTitle;
    }
    return '';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
        <Button
          size='small'
          variant='outlined'
          onClick={onClickShowCountryFilters}
          color={colorScheme.muiColor}
        >
          {showCountryFilters ? 'Hide Country Filter' : 'Show Country Filter'}
        </Button>
        <Button
          size='small'
          variant='outlined'
          onClick={onClickShowProviderFilters}
          color={colorScheme.muiColor}
        >
          {showProviderFilters ? 'Hide Provider Filter' : 'Show Provider Filter'}
        </Button>
      </Box>
      {showCountryFilters && (
        <CountryFilter
          defaultSelectAll
          selectAllValue={selectAll}
          onChangeSelectAll={onChangeSelectAllCountries}
          countryList={countryProviders}
          countryListSelected={countryListSelected}
          onChangeCountry={(country) => onClickChangeCountry(country)}
          onClickApplyCountryFilter={onClickApplyCountryFilter}
          colorScheme={colorScheme}
          showApplyFilter={false}
        />
      )}
      {showProviderFilters && (
        <ProviderFilter
          showSelectAll
          selectAllValue={selectAllProviders}
          onChangeSelectAll={onChangeSelectAllProviders}
          providerList={providersList}
          providerListSelected={providerListSelected}
          onChangeProvider={(provider) => onClickChangeProvider(provider)}
        />
      )}
      <br />
      <Box sx={{ pb: 2, pt: 3, textAlign: 'center' }}>
        {movieResult.posterPath && (
          <Box
            component='img'
            src={`https://image.tmdb.org/t/p/w500/${movieResult.posterPath}`}
            alt={getName()}
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
          {getName()}
          {showWatchlistIcon ? (
            <Box sx={{ textAlign: 'center' }}>
              <Tooltip title='Add to watchlist and receive notification when available according with your preferences'>
                <Checkbox
                  icon={<FavoriteBorder />}
                  checkedIcon={<Favorite />}
                  color='error'
                  onChange={onSelectWatchlist}
                  checked={(movieResult && movieResult.watchlist) || false}
                  sx={{ '& .MuiSvgIcon-root': { fontSize: 35 } }}
                />
              </Tooltip>
            </Box>
          ) : (
            <></>
          )}
        </Link>
        <UserScore
          score={movieResult.voteAverage}
          voteCount={movieResult.voteCount}
          color={colorScheme.active}
        />
      </Box>

      <Grid container spacing={3} columns={{ xs: 1, sm: 8, md: 12 }} key='providersGrid'>
        {countryProvidersFiltered.map((countryItem) => (
          <Grid item xs={1} sm={3} md={3} key={countryItem.country}>
            <CountryStreamingCard countryProviders={countryItem} colorScheme={colorScheme} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

MovieStreamingDetails.propTypes = {
  onClickShowCountryFilters: PropTypes.func.isRequired,
  showCountryFilters: PropTypes.bool.isRequired,
  selectAll: PropTypes.bool.isRequired,
  onChangeSelectAllCountries: PropTypes.func.isRequired,
  countryProviders: PropTypes.arrayOf(PropTypes.object).isRequired,
  countryListSelected: PropTypes.object.isRequired,
  onClickChangeCountry: PropTypes.func.isRequired,
  onClickApplyCountryFilter: PropTypes.func.isRequired,
  onClickShowProviderFilters: PropTypes.func.isRequired,
  showProviderFilters: PropTypes.bool.isRequired,
  selectAllProviders: PropTypes.bool.isRequired,
  onChangeSelectAllProviders: PropTypes.func.isRequired,
  providersList: PropTypes.arrayOf(PropTypes.string).isRequired,
  providerListSelected: PropTypes.object.isRequired,
  onClickChangeProvider: PropTypes.func.isRequired,
  streaming: PropTypes.object.isRequired,
  countryProvidersFiltered: PropTypes.arrayOf(PropTypes.object).isRequired,
  colorScheme: PropTypes.shape(ColorScheme).isRequired,
  showWatchlistIcon: PropTypes.bool.isRequired,
  onSelectWatchlist: PropTypes.func.isRequired,
  movieResult: PropTypes.shape(MovieResultShape).isRequired,
};

export default MovieStreamingDetails;
