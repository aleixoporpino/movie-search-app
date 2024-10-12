import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Badge } from '@mui/material';
import Person from '@mui/icons-material/Person';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import properties from '../../app.properties';

const WebSocketComponent = ({ page }) => {
  const [, setSocket] = useState(null);
  const [clientCount, setClientCount] = useState(0);

  useEffect(() => {
    const wsURL = `wss:${properties.API_URL.split(':')[1].split('api/v1/')[0]}ws`;
    const ws = new WebSocket(wsURL);
    setSocket(ws);

    ws.onopen = () => {
      ws.send(JSON.stringify({ page }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.clientCount !== undefined) {
        setClientCount(data.clientCount);
      }
    };

    return () => ws.close();
  }, [page]);

  return (
    <div>
      {clientCount !== 0 ? (
        <>
          <Box
            sx={{
              position: 'fixed',
              bottom: 20,
              left: 0,
              right: 25,
              textAlign: 'right',
              transition: 'opacity 0.3s',
              '&:hover': {
                opacity: 1,
              },
              opacity: 0.6,
            }}
          >
            <Badge
              badgeContent={clientCount}
              color='success'
              sx={{
                transition: 'opacity 0.3s',
                '&:hover': {
                  opacity: 1,
                },
                opacity: 0.6,
              }}
            >
              <Tooltip title={`Users on this page ${clientCount}`}>
                <Person color='action' />
              </Tooltip>
            </Badge>
          </Box>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default WebSocketComponent;

WebSocketComponent.propTypes = {
  page: PropTypes.string.isRequired,
};
