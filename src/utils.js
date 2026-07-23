const PROVIDER_TYPES = ['flatrate', 'rent', 'buy'];

export const getCountryProvidersFormatted = (data) => {
  const countryProviders = [];
  if (data.results) {
    Object.keys(data.results).forEach((country) => {
      const countryData = data.results[country];
      const entry = { country };
      PROVIDER_TYPES.forEach((type) => {
        if (countryData[type]) {
          entry[type] = {
            streaming: countryData[type].map((provider) => provider.providerName),
            logoPath: countryData[type].map((provider) => provider.logoPath),
          };
        }
      });
      if (PROVIDER_TYPES.some((type) => entry[type])) {
        countryProviders.push(entry);
      }
    });
  }

  return countryProviders;
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
    if (selectedCountries[item.country] !== false) {
      newFilteredArray.push(item);
    }
  });
  return newFilteredArray;
};
