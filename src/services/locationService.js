const axios = require("axios");

const getRegions = async () => {
  try {
    const response = await axios.get("https://psgc.gitlab.io/api/regions", {
      timeout: 5000,
    });
    const sortedRegions = response.data.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    return {
      status: response.status,
      data: sortedRegions,
    };
  } catch (error) {
    console.error("Error in getRegions service:", error);
    throw error;
  }
};

const getProvinces = async (regionCode) => {
  try {
    const response = await axios.get("https://psgc.gitlab.io/api/provinces", {
      timeout: 5000,
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
  } catch (error) {
    console.error("Error in getProvinces service:", error);
    throw error;
  }
};

const getCitiesAndMunicipalities = async (provinceCode) => {
  try {
    const response = await axios.get(
      "https://psgc.gitlab.io/api/cities-municipalities",
      { timeout: 5000 }
    );
    const filteredCities = response.data.filter(
      (city) => city.provinceCode === provinceCode
    );
    const sortedCities = filteredCities.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    return {
      status: response.status,
      data: sortedCities,
    };
  } catch (error) {
    console.error("Error in getCitiesAndMunicipalities service:", error);
    throw error;
  }
};

const getBarangays = async (municipalityCode) => {
  try {
    const response = await axios.get("https://psgc.gitlab.io/api/barangays", {
      timeout: 5000,
    });
    const municipalityCodeStr = String(municipalityCode).trim();
    const filteredBarangays = response.data.filter(
      (barangay) =>
        String(barangay.municipalityCode).trim() === municipalityCodeStr
    );
    const sortedBarangays = filteredBarangays.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    return {
      status: response.status,
      data: sortedBarangays,
    };
  } catch (error) {
    console.error("Error in getBarangays service:", error);
    throw error;
  }
};

module.exports = {
  getRegions,
  getProvinces,
  getCitiesAndMunicipalities,
  getBarangays,
};
