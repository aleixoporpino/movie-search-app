import React from 'react';
import PropTypes from 'prop-types';
import {
  getProvidersById,
  getTvShowById,
  getTvShowsByName,
  saveTvShowWatchlist,
} from '../api/tvShowApi';
import MainContainer from './MainContainer';
import { tvShowsColors } from '../utils/colorScheme';
import { UserShape } from '../shapes/UserShape';

const TVShowsPage = ({ user }) => {
  const applyWatchlistTvShows = (data) => {
    const noUserWatchlist =
      !user ||
      !user.watchlist ||
      !user.watchlist.tvShows ||
      !user.watchlist.tvShows.length > 0 ||
      !data ||
      !data.results ||
      !data.results.length > 0;

    if (noUserWatchlist) {
      return data;
    }

    const tvShowIdMap = {};
    user.watchlist.tvShows.forEach((tvShow) => {
      tvShowIdMap[tvShow.id] = tvShow.watchlist;
    });

    const updatedData = { ...data };
    updatedData.results = [];
    data.results.forEach((tvShow) => {
      const updatedTvShow = { ...tvShow };
      updatedTvShow.watchlist = !!tvShowIdMap[tvShow.id];
      updatedData.results.push(updatedTvShow);
    });

    return updatedData;
  };
  return (
    <MainContainer
      page='TV Shows'
      getByName={getTvShowsByName}
      getProvidersById={getProvidersById}
      getById={getTvShowById}
      searchInputLabel='Enter a TV Show name'
      colorScheme={tvShowsColors}
      saveWatchlist={saveTvShowWatchlist}
      applyWatchlist={(data) => applyWatchlistTvShows(data)}
    />
  );
};

TVShowsPage.propTypes = {
  user: PropTypes.shape(UserShape),
};

TVShowsPage.defaultProps = {
  user: {},
};

export default TVShowsPage;
