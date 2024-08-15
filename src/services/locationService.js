const axios = require("axios");

const getRegions = async () => {
  try {
    const response = await axios.get("https://psgc.gitlab.io/api/regions");
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error("Error in getRegions service:", error);
    throw error;
  }
};

const getProvinces = async (regionCode) => {
  try {
    const response = await axios.get(`https://psgc.gitlab.io/api/provinces`);
    const filteredProvinces = response.data.filter(
      (province) => province.regionCode === regionCode
    );
    return {
      status: response.status,
      data: filteredProvinces,
    };
  } catch (error) {
    console.error("Error in getProvinces service:", error);
    throw error;
  }
};

const getCitiesAndMunicipalities = async (provinceCode) => {
  try {
    const response = await axios.get(
      "https://psgc.gitlab.io/api/cities-municipalities"
    );
    const filteredCities = response.data.filter(
      (city) => city.provinceCode === provinceCode
    );
    return {
      status: response.status,
      data: filteredCities,
    };
  } catch (error) {
    console.error("Error in getCitiesAndMunicipalities service:", error);
    throw error;
  }
};

const getBarangays = async (municipalityCode) => {
  try {
    const response = await axios.get("https://psgc.gitlab.io/api/barangays");

    const municipalityCodeStr = String(municipalityCode).trim();

    const filteredBarangays = response.data.filter(
      (barangay) =>
        String(barangay.municipalityCode).trim() === municipalityCodeStr
    );
    return {
      status: response.status,
      data: filteredBarangays,
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
