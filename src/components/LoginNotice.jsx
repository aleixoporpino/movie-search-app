import Alert from '@mui/material/Alert';
import React, { useEffect, useState } from 'react';

// The API sends a failed login back to the site as #login=failed or
// #login=cancelled; anything else in the fragment is ignored.
const MESSAGES = {
  failed: { severity: 'error', text: 'Login failed. Please try again.' },
  cancelled: { severity: 'info', text: 'Login was cancelled.' },
};

const readReason = () => new URLSearchParams(window.location.hash.replace(/^#/, '')).get('login');

const LoginNotice = () => {
  const [reason] = useState(readReason);
  const [open, setOpen] = useState(true);
  const message = MESSAGES[reason];

  useEffect(() => {
    if (message) {
      // Drop the fragment so a refresh doesn't show the message again.
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, [message]);

  if (!message || !open) {
    return null;
  }

  return (
    <Alert
      severity={message.severity}
      variant='outlined'
      sx={{ mt: 2 }}
      role='alert'
      onClose={() => setOpen(false)}
    >
      {message.text}
    </Alert>
  );
};

export default LoginNotice;
