import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';
import LoadingButton from '@mui/lab/LoadingButton';
import { ColorScheme } from '../shapes/MemberShape';

const SearchComponent = ({ value, setValue, onSearch, loading = false, label, colorScheme }) => {
  const onKeyPress = (e) => {
    if (
      e.code === 'Enter' ||
      e.code === 'Return' ||
      e.nativeEvent.key === 'Enter' ||
      e.nativeEvent.key === 'Return'
    ) {
      onSearch();
    }
  };
  return (
    <Box>
      <Grid container spacing={{ xs: 1, sm: 1, md: 1 }} columns={{ xs: 3, sm: 12, md: 12 }}>
        <Grid item xs={2} sm={11} md={11}>
          <TextField
            name='movieName'
            fullWidth
            id='movieName'
            label={label}
            onChange={(e) => setValue(e.target.value)}
            value={value}
            onKeyPress={(e) => onKeyPress(e)}
            color={colorScheme.muiColor}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={1} sm={1} md={1}>
          <LoadingButton
            onClick={() => onSearch()}
            loading={loading}
            variant='contained'
            color={colorScheme.muiColor}
            sx={{ paddingTop: '16px', paddingBottom: '15.5px' }}
          >
            Search
          </LoadingButton>
        </Grid>
      </Grid>
    </Box>
  );
};

SearchComponent.propTypes = {
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  colorScheme: PropTypes.shape(ColorScheme).isRequired,
};

export default SearchComponent;
