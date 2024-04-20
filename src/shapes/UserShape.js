import PropTypes from 'prop-types';
import { WatchlistShape } from './WatchlistShape';

export const UserShape = {
  avatarURL: PropTypes.string,
  email: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  name: PropTypes.string,
  watchlist: PropTypes.shape(WatchlistShape),
};
