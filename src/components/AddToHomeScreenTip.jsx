import React, { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const DISMISSED_KEY = 'addToHomeScreenTipDismissed';

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

const AddToHomeScreenTip = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isStandalone() && !localStorage.getItem(DISMISSED_KEY)) {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem(DISMISSED_KEY, 'true');
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity='info' variant='filled' sx={{ width: '100%' }}>
        Use this website like an app. Tap &quot;Share&quot;, then &quot;Add to Home Screen&quot;.
      </Alert>
    </Snackbar>
  );
};

export default AddToHomeScreenTip;
