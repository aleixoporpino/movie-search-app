export const getCountryStreamingFormatted = (data) => {
  let countryIndex = 0;
  const countryFlat = [];
  if (data.results) {
    Object.keys(data.results).map((country) => {
      if (data.results[country].flatrate) {
        countryIndex = countryFlat.length;
        countryFlat.push({ country, streaming: [], logoPath: [] });
        data.results[country].flatrate.map((flat) => {
          countryFlat[countryIndex].streaming.push(flat.providerName);
          countryFlat[countryIndex].logoPath.push(flat.logoPath);
          return countryFlat;
        });
      }
      return countryFlat;
    });
  }

  return countryFlat;
};

export const getCountryListSelected = (countryFlat, user) => {
  // Use user preferences
  if (user && user.watchlist && user.watchlist.countries && user.watchlist.countries.length > 0) {
    const userCountries = user.watchlist.countries.reduce((acc, curr) => {
      acc[curr] = curr;
      return acc;
    }, {});
    const countryList = {};
    countryFlat.forEach((v) => {
      if (userCountries[v.country]) {
        countryList[v.country] = true;
      } else {
        countryList[v.country] = false;
      }
    });
    return countryList;
  }

  const countryList = {};
  countryFlat.forEach((v) => {
    countryList[v.country] = true;
  });
  return countryList;
};

export const getCountryStreamingFiltered = (countriesStreaming, selectedCountries) => {
  const newFilteredArray = [];
  countriesStreaming.forEach((item) => {
    if (selectedCountries[item.country]) {
      newFilteredArray.push(item);
    }
  });
  return newFilteredArray;
};
