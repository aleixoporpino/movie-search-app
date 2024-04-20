import PropTypes from 'prop-types';

export const MediaShape = {
  backdropPath: PropTypes.string,
  id: PropTypes.number.isRequired,
  originalTitle: PropTypes.string.isRequired,
  overview: PropTypes.string,
  posterPath: PropTypes.string,
  releaseDate: PropTypes.string,
  watchlist: PropTypes.bool,
};
