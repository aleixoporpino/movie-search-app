import React from 'react';
import { getMovieById, getMoviesByName, getProvidersById } from '../api/movieApi';
import MainContainer from './MainContainer';
import { movieColors } from '../utils/colorScheme';

const MoviesPage = () => (
  <MainContainer
    getByName={getMoviesByName}
    getProvidersById={getProvidersById}
    getById={getMovieById}
    searchInputLabel='Enter a movie title'
    colorScheme={movieColors}
  />
);

export default MoviesPage;
