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

export const getCountryListSelected = (countryFlat) => {
  const countryList = {};
  countryFlat.forEach((v) => {
    countryList[v.country] = true;
  });
  return countryList;
};
