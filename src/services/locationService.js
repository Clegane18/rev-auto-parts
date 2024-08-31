const axios = require("axios");
const axiosRetry = require("axios-retry").default;

const axiosInstance = axios.create({
  timeout: 10000,
});

axiosRetry(axiosInstance, {
  retries: 3,
  retryDelay: (retryCount) => {
    console.log(`Retry attempt: ${retryCount}`);
    return retryCount * 1000;
  },
  retryCondition: (error) => {
    console.log(`Retry condition check for error: ${error.message}`);
    const shouldRetry =
      error.code === "ECONNABORTED" ||
      error.message.includes("timeout") ||
      axiosRetry.isRetryableError(error) ||
      (error.response && [500, 502, 503, 504].includes(error.response.status));

    console.log(`Should retry: ${shouldRetry}`);
    return shouldRetry;
  },
});

// Simple in-memory cache
const cache = {};

// Cache expiration (10 minutes)
const CACHE_EXPIRATION = 10 * 60 * 1000;

const getCachedData = async (cacheKey, fetchFunction) => {
  const now = Date.now();

  if (cache[cacheKey] && cache[cacheKey].expiration > now) {
    return cache[cacheKey].data;
  }

  try {
    const data = await fetchFunction();
    cache[cacheKey] = {
      data,
      expiration: now + CACHE_EXPIRATION,
    };
    return data;
  } catch (error) {
    console.error(`Failed to fetch data for ${cacheKey}:`, error.message);
    throw error;
  }
};

const getRegions = async () => {
  const cacheKey = "regions";
  return getCachedData(cacheKey, async () => {
    try {
      const response = await axiosInstance.get(
        "https://psgc.gitlab.io/api/regions"
      );
      const sortedRegions = response.data.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      return {
        status: response.status,
        data: sortedRegions,
      };
    } catch (error) {
      console.error(`Error fetching regions: ${error}`);
      throw error;
    }
  });
};

const getProvincesOrCities = async (regionCode) => {
  const cacheKey = `provincesOrCities_${regionCode}`;
  return getCachedData(cacheKey, async () => {
    try {
      if (regionCode === "130000000") {
        const response = await axiosInstance.get(
          "https://psgc.gitlab.io/api/cities-municipalities"
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
        const response = await axiosInstance.get(
          "https://psgc.gitlab.io/api/provinces"
        );
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
    } catch (error) {
      console.error(`Error fetching provinces or cities: ${error}`);
      throw error;
    }
  });
};

const getCitiesAndMunicipalities = async (provinceOrCityCode) => {
  const cacheKey = `citiesAndMunicipalities_${provinceOrCityCode}`;
  return getCachedData(cacheKey, async () => {
    try {
      const response = await axiosInstance.get(
        "https://psgc.gitlab.io/api/cities-municipalities"
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
    } catch (error) {
      console.error(`Error fetching cities and municipalities: ${error}`);
      throw error;
    }
  });
};

const getBarangays = async (municipalityOrCityCode) => {
  const cacheKey = `barangays_${municipalityOrCityCode}`;
  return getCachedData(cacheKey, async () => {
    try {
      const response = await axiosInstance.get(
        "https://psgc.gitlab.io/api/barangays"
      );
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
    } catch (error) {
      console.error(`Error fetching barangays: ${error}`);
      throw error;
    }
  });
};

module.exports = {
  getRegions,
  getProvincesOrCities,
  getCitiesAndMunicipalities,
  getBarangays,
};
