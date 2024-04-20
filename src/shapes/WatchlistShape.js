import PropTypes, { shape } from 'prop-types';
import { MediaShape } from './MediaShape';

export const WatchlistShape = {
  buy: PropTypes.bool.isRequired,
  countries: PropTypes.arrayOf(PropTypes.string),
  movies: PropTypes.arrayOf(shape(MediaShape)),
  rent: PropTypes.bool.isRequired,
  streaming: PropTypes.bool.isRequired,
  tvShows: PropTypes.arrayOf(shape(MediaShape)),
};
