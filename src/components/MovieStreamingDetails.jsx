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
import { ColorScheme } from '../shapes/MemberShape';

const MovieStreamingDetails = ({
  onClickShowFilters,
  showFilters,
  selectAll,
  onChangeSelectAllCountries,
  countryStreaming,
  countryListSelected,
  onClickChangeCountry,
  onClickApplyCountryFilter,
  streaming,
  countryStreamingFiltered,
  colorScheme,
  showWatchlistIcon,
  onSelectWatchlist,
  movieResult,
}) => (
  <Box>
    <Button
      size='small'
      variant='outlined'
      onClick={onClickShowFilters}
      color={colorScheme.muiColor}
      sx={{ mb: 1 }}
    >
      {showFilters ? 'Hide filters' : 'Show filters'}
    </Button>
    {showFilters && (
      <CountryFilter
        defaultSelectAll
        selectAllValue={selectAll}
        onChangeSelectAll={onChangeSelectAllCountries}
        countryList={countryStreaming}
        countryListSelected={countryListSelected}
        onChangeCountry={(country) => onClickChangeCountry(country)}
        onClickApplyCountryFilter={onClickApplyCountryFilter}
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
        {movieResult && movieResult.originalTitle ? movieResult.originalTitle : ''}
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
            <CountryStreamingCard countryFlatrate={countryFlatrate} colorScheme={colorScheme} />
          </Grid>
        </>
      ))}
    </Grid>
  </Box>
);

MovieStreamingDetails.propTypes = {
  onClickShowFilters: PropTypes.func.isRequired,
  showFilters: PropTypes.bool.isRequired,
  selectAll: PropTypes.bool.isRequired,
  onChangeSelectAllCountries: PropTypes.func.isRequired,
  countryStreaming: PropTypes.arrayOf(PropTypes.object).isRequired,
  countryListSelected: PropTypes.object.isRequired,
  onClickChangeCountry: PropTypes.func.isRequired,
  onClickApplyCountryFilter: PropTypes.func.isRequired,
  streaming: PropTypes.object.isRequired,
  countryStreamingFiltered: PropTypes.arrayOf(PropTypes.object).isRequired,
  colorScheme: PropTypes.shape(ColorScheme).isRequired,
};

export default MovieStreamingDetails;
