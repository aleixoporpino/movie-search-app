import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

const ProviderFilter = ({
  selectAllValue,
  onChangeSelectAll,
  providerList,
  providerListSelected,
  onChangeProvider,
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
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        columnGap: 1,
        rowGap: 0,
      }}
    >
      {providerList.map((provider) => (
        <FormControlLabel
          key={provider}
          sx={{ m: 0 }}
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
  </Box>
);

ProviderFilter.propTypes = {
  selectAllValue: PropTypes.bool,
  onChangeSelectAll: PropTypes.func,
  providerList: PropTypes.arrayOf(PropTypes.string).isRequired,
  providerListSelected: PropTypes.object.isRequired,
  onChangeProvider: PropTypes.func.isRequired,
  showSelectAll: PropTypes.bool,
};

ProviderFilter.defaultProps = {
  selectAllValue: false,
  onChangeSelectAll: () => {},
  showSelectAll: false,
};

export default ProviderFilter;
