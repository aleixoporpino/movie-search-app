import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import CountryCodeEnum from '../utils/CountryCodeEnum';
import { ColorScheme } from '../shapes/MemberShape';

const CountryFilter = ({
  selectAllValue,
  onChangeSelectAll,
  countryList,
  countryListSelected,
  onChangeCountry,
  onClickApplyCountryFilter,
  colorScheme,
  showApplyFilter,
  showSelectAll,
}) => (
  <Box>
    {showSelectAll ? (
      <FormControlLabel
        control={<Checkbox onChange={() => onChangeSelectAll()} checked={selectAllValue} />}
        label={selectAllValue ? 'Deselect all' : 'Select all'}
        labelPlacement='end'
      />
    ) : (
      <></>
    )}
    {countryList.map((item) => (
      <FormControlLabel
        key={item.country}
        control={
          <>
            <Checkbox
              key={item.country}
              checked={countryListSelected[item.country]}
              onChange={() => onChangeCountry(item.country)}
              name={item.country}
              color='info'
            />
            <img
              src={`https://flagcdn.com/w20/${item.country.toLowerCase()}.png`}
              width='16'
              height='12'
              alt={CountryCodeEnum[item.country]}
            />
          </>
        }
        label={item.country}
        labelPlacement='end'
      />
    ))}
    {showApplyFilter ? (
      <Button
        variant='outlined'
        onClick={() => onClickApplyCountryFilter()}
        color={colorScheme.muiColor}
        size='small'
      >
        Apply filters
      </Button>
    ) : (
      <></>
    )}
  </Box>
);

CountryFilter.propTypes = {
  selectAllValue: PropTypes.bool.isRequired,
  onChangeSelectAll: PropTypes.func.isRequired,
  countryList: PropTypes.array.isRequired,
  countryListSelected: PropTypes.object.isRequired,
  onChangeCountry: PropTypes.func.isRequired,
  onClickApplyCountryFilter: PropTypes.func,
  colorScheme: PropTypes.shape(ColorScheme).isRequired,
  showApplyFilter: PropTypes.bool,
  showSelectAll: PropTypes.bool,
};

CountryFilter.defaultProps = {
  showApplyFilter: true,
  showSelectAll: true,
  onClickApplyCountryFilter: () => {},
};

export default CountryFilter;
