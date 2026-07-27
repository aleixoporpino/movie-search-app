import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import { HomeOutlined, PersonOutline, FavoriteBorder, Logout } from '@mui/icons-material';
import PropTypes from 'prop-types';
import { UserShape } from '../shapes/UserShape';
import { ColorScheme } from '../shapes/MemberShape';

const SETTINGS = [
  { label: 'Home', icon: HomeOutlined },
  { label: 'Profile', icon: PersonOutline },
  { label: 'Watchlist', icon: FavoriteBorder },
];

const UserCard = ({
  user,
  handleHome,
  handleProfile,
  handleWatchlist,
  handleLogout,
  colorScheme,
}) => {
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

  const displayName = user.firstName
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : 'Account';

  return (
    <Box>
      <Tooltip title='User settings'>
        <IconButton
          onClick={handleOpenUserMenu}
          sx={{
            p: '2px',
            border: `1px solid ${anchorElUser ? colorScheme.active : 'transparent'}`,
            transition: 'border-color .2s ease',
          }}
        >
          <Avatar alt='User avatar' src={user.avatarURL} sx={{ width: 34, height: 34 }} />
        </IconButton>
      </Tooltip>

      <Menu
        sx={{
          mt: '45px',
          '& .MuiPaper-root': {
            minWidth: 220,
            border: '1px solid rgba(215,165,68,0.16)',
            boxShadow: '0 14px 30px -14px rgba(0,0,0,0.7)',
            borderRadius: 1,
          },
          '& .MuiList-root': { py: 0.5 },
        }}
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
        onClose={() => handleCloseUserMenu()}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.5 }}>
          <Avatar alt='User avatar' src={user.avatarURL} sx={{ width: 36, height: 36 }} />
          <Box sx={{ minWidth: 0 }}>
            <Typography variant='body2' noWrap sx={{ fontWeight: 600 }}>
              {displayName}
            </Typography>
            <Typography variant='caption' color='text.secondary' noWrap component='div'>
              {user.email}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ borderColor: 'rgba(215,165,68,0.16)' }} />
        {SETTINGS.map(({ label, icon: Icon }) => (
          <MenuItem
            key={label}
            onClick={() => handleCloseUserMenu(label)}
            sx={{
              py: 1,
              px: 2,
              '&:hover': {
                bgcolor: 'rgba(215,165,68,0.08)',
                color: colorScheme.active,
                '& .MuiListItemIcon-root': { color: colorScheme.active },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 34, color: 'text.secondary' }}>
              <Icon fontSize='small' />
            </ListItemIcon>
            <Typography variant='body2'>{label}</Typography>
          </MenuItem>
        ))}
        <Divider sx={{ borderColor: 'rgba(215,165,68,0.16)' }} />
        <MenuItem
          onClick={() => handleCloseUserMenu('Logout')}
          sx={{
            py: 1,
            px: 2,
            color: '#e57373',
            '&:hover': { bgcolor: 'rgba(229,115,115,0.08)' },
          }}
        >
          <ListItemIcon sx={{ minWidth: 34, color: 'inherit' }}>
            <Logout fontSize='small' />
          </ListItemIcon>
          <Typography variant='body2'>Logout</Typography>
        </MenuItem>
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
  colorScheme: PropTypes.shape(ColorScheme).isRequired,
};

export default UserCard;
