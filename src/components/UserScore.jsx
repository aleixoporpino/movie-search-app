import React from 'react';
import { Tooltip, Typography, Box } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import PropTypes from 'prop-types';

const UserScore = ({ score, voteCount, color }) => (
  <>
    {score ? (
      <Box display='flex' alignItems='center' color={color}>
        <Tooltip title={`${voteCount} ratings`} arrow>
          <StarIcon style={{ marginLeft: '8px', cursor: 'pointer' }} />
        </Tooltip>
        <Typography variant='h6'>User score: {score ? score.toFixed(1) : -1}%</Typography>
      </Box>
    ) : (
      <></>
    )}
  </>
);

UserScore.propTypes = {
  score: PropTypes.number,
  voteCount: PropTypes.number,
  color: PropTypes.string.isRequired,
};

UserScore.defaultProps = {
  score: 0,
  voteCount: 0,
};

export default UserScore;
