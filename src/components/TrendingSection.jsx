import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import { getTopSearches } from '../api/statsApi';
import { ColorScheme } from '../shapes/MemberShape';

const TrendingSection = ({ mediaType, colorScheme, onClickItem }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getTopSearches({ mediaType, period: 'week' })
      .then((response) => {
        setItems((response.data || []).filter((item) => item.title));
      })
      .catch(() => {
        setItems([]);
      })
      .finally(() => setLoading(false));
  }, [mediaType]);

  if (!loading && items.length === 0) {
    return null;
  }

  return (
    <Box sx={{ pt: 1, pb: 2, textAlign: 'center' }}>
      <Typography variant='overline' color='text.secondary' sx={{ letterSpacing: '0.12em' }}>
        Trending this week
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', pt: 1 }}>
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <Skeleton
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                variant='rounded'
                width={110}
                height={32}
                sx={{ borderRadius: '16px' }}
              />
            ))
          : items.map((item) => (
              <Chip
                key={`${item.mediaType}-${item.mediaId}`}
                label={item.title}
                clickable
                variant='outlined'
                onClick={() => onClickItem(item.mediaId)}
                sx={{ borderColor: colorScheme.active, color: 'text.primary' }}
              />
            ))}
      </Box>
    </Box>
  );
};

TrendingSection.propTypes = {
  mediaType: PropTypes.oneOf(['movie', 'tvshow']).isRequired,
  colorScheme: PropTypes.shape(ColorScheme).isRequired,
  onClickItem: PropTypes.func.isRequired,
};

export default TrendingSection;
