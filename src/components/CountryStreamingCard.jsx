import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CountryCodeEnum from '../utils/CountryCodeEnum';
import { ColorScheme } from '../shapes/MemberShape';
import JustWatchWidget from './JustWatchWidget';

const PROVIDER_TABS = [
  { type: 'flatrate', label: 'Stream' },
  { type: 'rent', label: 'Rent' },
  { type: 'buy', label: 'Buy' },
];

const CountryStreamingCard = ({ countryProviders, colorScheme }) => {
  const availableTabs = PROVIDER_TABS.filter(({ type }) => countryProviders[type]);
  const [activeType, setActiveType] = useState(
    availableTabs.length > 0 ? availableTabs[0].type : undefined,
  );
  const activeSection = countryProviders[activeType];

  return (
    <Card
      variant='outlined'
      sx={{ border: `0.1px solid ${colorScheme.active}` }}
      key={countryProviders.country}
    >
      <CardContent>
        <Box sx={{ textAlign: 'center', pb: 2 }}>
          <img
            src={`https://flagcdn.com/w40/${countryProviders.country.toLowerCase()}.png`}
            width='32'
            height='24'
            alt={CountryCodeEnum[countryProviders.country]}
          />
        </Box>

        <Typography variant='h5' sx={{ pb: 1 }} align='center'>{`${countryProviders.country} - ${
          CountryCodeEnum[countryProviders.country]
        }`}</Typography>

        {availableTabs.length > 1 && (
          <Tabs
            value={activeType}
            onChange={(event, newValue) => setActiveType(newValue)}
            variant='fullWidth'
            sx={{
              mb: 1,
              minHeight: 36,
              '& .MuiTabs-indicator': { backgroundColor: colorScheme.active },
              '& .MuiTab-root': { minHeight: 36 },
              '& .MuiTab-root.Mui-selected': {
                color: colorScheme.active,
                fontWeight: 700,
              },
            }}
          >
            {availableTabs.map(({ type, label }) => (
              <Tab key={type} value={type} label={label} />
            ))}
          </Tabs>
        )}

        {activeSection &&
          activeSection.streaming.map((str, index) => (
            <Box key={str} sx={{ display: 'flex', alignItems: 'center', pb: 0.5 }}>
              <img
                style={{ paddingRight: '10px' }}
                width='40px'
                src={`https://image.tmdb.org/t/p/w200/${activeSection.logoPath[index]}`}
                alt={str}
              />
              <Typography variant='body1'>{str}</Typography>
            </Box>
          ))}
      </CardContent>
      <JustWatchWidget country={countryProviders.country} />
    </Card>
  );
};
CountryStreamingCard.propTypes = {
  countryProviders: PropTypes.object.isRequired,
  colorScheme: PropTypes.shape(ColorScheme).isRequired,
};
export default CountryStreamingCard;
