import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CountryCodeEnum from '../utils/CountryCodeEnum';
import { ColorScheme } from '../shapes/MemberShape';

const CountryStreamingCard = ({ countryFlatrate, colorScheme }) => (
  <Card
    variant='outlined'
    sx={{ border: `0.1px solid ${colorScheme.active}` }}
    key={countryFlatrate.country}
  >
    <CardContent>
      <Box sx={{ textAlign: 'center', pb: 2 }}>
        <img
          src={`https://flagcdn.com/w40/${countryFlatrate.country.toLowerCase()}.png`}
          width='32'
          height='24'
          alt={CountryCodeEnum[countryFlatrate.country]}
        />
      </Box>

      <Typography variant='h5' sx={{ pb: 1 }} align='center'>{`${countryFlatrate.country} - ${
        CountryCodeEnum[countryFlatrate.country]
      }`}</Typography>
      {countryFlatrate.streaming &&
        countryFlatrate.streaming.length > 0 &&
        countryFlatrate.streaming.map((str, index) => (
          <Box key={countryFlatrate.country + str}>
            <img
              style={{ paddingRight: '10px' }}
              width='45px'
              src={`https://image.tmdb.org/t/p/w200/${countryFlatrate.logoPath[index]}`}
              alt={countryFlatrate.streaming}
            />
            <Typography variant='h7'>{str}</Typography>
          </Box>
        ))}
    </CardContent>
  </Card>
);
CountryStreamingCard.propTypes = {
  countryFlatrate: PropTypes.object.isRequired,
  colorScheme: PropTypes.shape(ColorScheme).isRequired,
};
export default CountryStreamingCard;
