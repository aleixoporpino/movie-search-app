import React from 'react';
import PropTypes from 'prop-types';
import {
  getMovieById,
  getMoviesByName,
  getProvidersById,
  saveMovieWatchlist,
} from '../api/movieApi';
import MainContainer from './MainContainer';
import { movieColors } from '../utils/colorScheme';
import { UserShape } from '../shapes/UserShape';

const MoviesPage = ({ user }) => {
  const applyWatchlistMovies = (data) => {
    const noUserWatchlist =
      !user ||
      !user.watchlist ||
      !user.watchlist.movies ||
      !user.watchlist.movies.length > 0 ||
      !data ||
      !data.results ||
      !data.results.length > 0;

    if (noUserWatchlist) {
      return data;
    }

    const movieIdMap = {};
    user.watchlist.movies.forEach((movie) => {
      movieIdMap[movie.id] = movie.watchlist;
    });

    const updatedData = { ...data };
    updatedData.results = [];
    data.results.forEach((movie) => {
      const updatedMovie = { ...movie };
      updatedMovie.watchlist = !!movieIdMap[movie.id];
      updatedData.results.push(updatedMovie);
    });

    return updatedData;
  };

  return (
    <MainContainer
      getByName={getMoviesByName}
      getProvidersById={getProvidersById}
      getById={getMovieById}
      searchInputLabel='Enter a movie title'
      colorScheme={movieColors}
      saveWatchlist={saveMovieWatchlist}
      applyWatchlist={(data) => applyWatchlistMovies(data)}
    />
  );
};

MoviesPage.propTypes = {
  user: PropTypes.shape(UserShape),
};

MoviesPage.defaultProps = {
  user: {},
};

export default MoviesPage;
