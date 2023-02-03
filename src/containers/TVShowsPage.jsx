import React from 'react';
import { getTvShowById, getTvShowsByName } from '../api/tvShowApi';
import MainContainer from './MainContainer';
import { tvShowsColors } from '../utils/colorScheme';

const TVShowsPage = () => (
  <MainContainer
    getByName={getTvShowsByName}
    getById={getTvShowById}
    searchInputLabel='Enter a TV Show name'
    colorScheme={tvShowsColors}
  />
);

export default TVShowsPage;
