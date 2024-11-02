import React from 'react';
import { Tooltip, Typography, Box } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

const UserScore = ({ score, userVotes, color }) => (
  <>
    {score ? (
      <Box display='flex' alignItems='center' color={color}>
        <Tooltip title={`${userVotes} ratings`} arrow>
          <StarIcon style={{ marginLeft: '8px', cursor: 'pointer' }} />
        </Tooltip>
        <Typography variant='h6'>User score: {score.toFixed(1)}%</Typography>
      </Box>
    ) : (
      <></>
    )}
  </>
);

export default UserScore;
