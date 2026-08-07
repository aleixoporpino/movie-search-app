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

export const getProvidersListFormatted = (countryProviders) => {
  const providers = new Set();
  countryProviders.forEach((country) => {
    PROVIDER_TYPES.forEach((type) => {
      if (country[type]) {
        country[type].streaming.forEach((name) => providers.add(name));
      }
    });
  });
  return Array.from(providers).sort();
};

export const getProviderListSelected = (providersList, user) => {
  // Use user preferences
  if (user && user.watchlist && user.watchlist.providers && user.watchlist.providers.length > 0) {
    const userProviders = user.watchlist.providers.reduce((acc, curr) => {
      acc[curr] = curr;
      return acc;
    }, {});
    const providerList = {};
    providersList.forEach((v) => {
      providerList[v] = !!userProviders[v];
    });
    return providerList;
  }

  const providerList = {};
  providersList.forEach((v) => {
    providerList[v] = true;
  });
  return providerList;
};

export const getProviderStreamingFiltered = (countriesStreaming, selectedProviders) => {
  const newFilteredArray = [];
  countriesStreaming.forEach((item) => {
    const filteredItem = { country: item.country };
    let hasAnyType = false;
    PROVIDER_TYPES.forEach((type) => {
      if (item[type]) {
        const keptIndexes = [];
        item[type].streaming.forEach((name, idx) => {
          if (selectedProviders[name] !== false) {
            keptIndexes.push(idx);
          }
        });
        if (keptIndexes.length > 0) {
          filteredItem[type] = {
            streaming: keptIndexes.map((idx) => item[type].streaming[idx]),
            logoPath: keptIndexes.map((idx) => item[type].logoPath[idx]),
          };
          hasAnyType = true;
        }
      }
    });
    if (hasAnyType) {
      newFilteredArray.push(filteredItem);
    }
  });
  return newFilteredArray;
};
