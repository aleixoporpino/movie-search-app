import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import PropTypes from 'prop-types';
import { UserShape } from '../shapes/UserShape';

const UserCard = ({ user, handleHome, handleProfile, handleWatchlist, handleLogout }) => {
  const settings = ['Home', 'Profile', 'Watchlist', 'Logout'];
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (setting) => {
    setAnchorElUser(null);
    switch (setting) {
      case 'Home':
        handleHome();
        break;
      case 'Profile':
        handleProfile();
        break;
      case 'Watchlist':
        handleWatchlist();
        break;
      case 'Logout':
        handleLogout();
        break;
      default:
        break;
    }
  };
  return (
    <Box>
      <Tooltip title='User settings'>
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar alt='User avatar' src={user.avatarURL} />
        </IconButton>
      </Tooltip>

      <Menu
        sx={{ mt: '45px' }}
        id='menu-appbar'
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {settings.map((setting) => (
          <MenuItem key={setting} onClick={() => handleCloseUserMenu(setting)}>
            <Typography textAlign='center'>{setting}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

UserCard.propTypes = {
  user: PropTypes.shape(UserShape).isRequired,
  handleHome: PropTypes.func.isRequired,
  handleProfile: PropTypes.func.isRequired,
  handleLogout: PropTypes.func.isRequired,
  handleWatchlist: PropTypes.func.isRequired,
};

export default UserCard;
