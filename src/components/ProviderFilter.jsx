import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

const ProviderFilter = ({ providerList, providerListSelected, onChangeProvider }) => (
  <Box>
    {providerList.map((provider) => (
      <FormControlLabel
        key={provider}
        control={
          <Checkbox
            checked={!!providerListSelected[provider]}
            onChange={() => onChangeProvider(provider)}
            name={provider}
            color='info'
          />
        }
        label={provider}
        labelPlacement='end'
      />
    ))}
  </Box>
);

ProviderFilter.propTypes = {
  providerList: PropTypes.arrayOf(PropTypes.string).isRequired,
  providerListSelected: PropTypes.object.isRequired,
  onChangeProvider: PropTypes.func.isRequired,
};

export default ProviderFilter;
