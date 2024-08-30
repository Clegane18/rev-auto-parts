const axios = require("axios");
const axiosRetry = require("axios-retry").default;

// Simple in-memory cache
const cache = {};

// Cache expiration (10 minutes)
const CACHE_EXPIRATION = 10 * 60 * 1000;

// Retry functionality if the req in the external API failed
axiosRetry(axios, {
  retries: 3,
  retryDelay: (retryCount) => {
    console.log(`Retry attempt: ${retryCount}`);
    return retryCount * 1000;
  },
  retryCondition: (error) => {
    console.log(`Retry condition check for error: ${error.message}`);
    return (
      error.code === "ECONNABORTED" ||
      axiosRetry.isRetryableError(error) ||
      (error.response && error.response.status === 404)
    );
  },
});

const getCachedData = async (cacheKey, fetchFunction) => {
  const now = Date.now();

  if (cache[cacheKey] && cache[cacheKey].expiration > now) {
    return cache[cacheKey].data;
  }
  const data = await fetchFunction();

  cache[cacheKey] = {
    data,
    expiration: now + CACHE_EXPIRATION,
  };

  return data;
};

const getRegions = async () => {
  const cacheKey = "regions";
  return getCachedData(cacheKey, async () => {
    const response = await axios.get("https://psgc.gitlab.io/api/regions", {
      timeout: 10000,
    });
    const sortedRegions = response.data.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    return {
      status: response.status,
      data: sortedRegions,
    };
  });
};

const getProvincesOrCities = async (regionCode) => {
  const cacheKey = `provincesOrCities_${regionCode}`;
  return getCachedData(cacheKey, async () => {
    if (regionCode === "130000000") {
      const response = await axios.get(
        "https://psgc.gitlab.io/api/cities-municipalities",
        {
          timeout: 10000,
        }
      );
      const filteredCities = response.data.filter(
        (city) => city.regionCode === regionCode
      );
      const sortedCities = filteredCities.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      return {
        status: response.status,
        data: sortedCities,
      };
    } else {
      const response = await axios.get("https://psgc.gitlab.io/api/provinces", {
        timeout: 10000,
      });
      const filteredProvinces = response.data.filter(
        (province) => province.regionCode === regionCode
      );
      const sortedProvinces = filteredProvinces.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      return {
        status: response.status,
        data: sortedProvinces,
      };
    }
  });
};

const getCitiesAndMunicipalities = async (provinceOrCityCode) => {
  const cacheKey = `citiesAndMunicipalities_${provinceOrCityCode}`;
  return getCachedData(cacheKey, async () => {
    const response = await axios.get(
      "https://psgc.gitlab.io/api/cities-municipalities",
      { timeout: 10000 }
    );

    const filteredCities = response.data.filter(
      (city) =>
        city.provinceCode === provinceOrCityCode ||
        city.code === provinceOrCityCode
    );

    const sortedCities = filteredCities.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    return {
      status: response.status,
      data: sortedCities,
    };
  });
};

const getBarangays = async (municipalityOrCityCode, regionCode = null) => {
  const cacheKey = `barangays_${municipalityOrCityCode}`;
  return getCachedData(cacheKey, async () => {
    const response = await axios.get("https://psgc.gitlab.io/api/barangays", {
      timeout: 10000,
    });

    const targetCode = String(municipalityOrCityCode).trim();

    const filteredBarangays = response.data.filter((barangay) => {
      const barangayCode = barangay.cityCode
        ? String(barangay.cityCode).trim()
        : String(barangay.municipalityCode).trim();

      return barangayCode === targetCode;
    });

    const sortedBarangays = filteredBarangays.sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    return {
      status: response.status,
      data: sortedBarangays,
    };
  });
};

module.exports = {
  getRegions,
  getProvincesOrCities,
  getCitiesAndMunicipalities,
  getBarangays,
};
