import PropTypes from 'prop-types';

export const MovieResultShape = {
  originalTitle: PropTypes.string,
  title: PropTypes.string,
  watchlist: PropTypes.bool,
  voteAverage: PropTypes.number,
  voteCount: PropTypes.number,
};
