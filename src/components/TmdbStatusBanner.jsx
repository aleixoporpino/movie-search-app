import Alert from '@mui/material/Alert';
import React, { useEffect, useState } from 'react';
import { getStatus } from '../api/statusApi';

const POLL_INTERVAL_MS = 60 * 1000;

const MESSAGES = {
  degraded: {
    severity: 'warning',
    text: 'Movie data is slow or partly unavailable right now. Searches may fail, so try again in a few minutes.',
  },
  down: {
    severity: 'error',
    text: 'Movie data is temporarily unavailable. Searches will not work right now, so please try again in a few minutes.',
  },
};

const TmdbStatusBanner = () => {
  const [tmdbStatus, setTmdbStatus] = useState('ok');

  useEffect(() => {
    let cancelled = false;

    const refresh = () => {
      if (document.hidden) {
        return;
      }
      getStatus()
        .then((res) => {
          if (!cancelled) {
            setTmdbStatus((res.data && res.data.tmdb) || 'ok');
          }
        })
        // If the status can't be fetched, keep what we last knew; other
        // requests already show their own errors when the API is unreachable.
        .catch(() => {});
    };

    refresh();
    const interval = setInterval(refresh, POLL_INTERVAL_MS);
    document.addEventListener('visibilitychange', refresh);

    return () => {
      cancelled = true;
      clearInterval(interval);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, []);

  const message = MESSAGES[tmdbStatus];
  if (!message) {
    return null;
  }

  return (
    <Alert severity={message.severity} variant='outlined' sx={{ mt: 2 }} role='status'>
      {message.text}
    </Alert>
  );
};

export default TmdbStatusBanner;
