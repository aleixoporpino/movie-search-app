import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import React from 'react';
import PropTypes from 'prop-types';

const ErrorAlert = ({ showError, onClose }) => (
  <Collapse in={showError}>
    <Alert severity='error' sx={{ mb: 3 }} variant='outlined' onClose={onClose}>
      Oops! An expected error happened, try again later.
    </Alert>
  </Collapse>
);

ErrorAlert.propTypes = {
  showError: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ErrorAlert;
