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

const getProvinces = async () => {
  try {
    const response = await axios.get("https://psgc.gitlab.io/api/provinces");
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error("Error in getProvinces service:", error);
    throw error;
  }
};

const getCitiesAndMunicipalities = async () => {
  try {
    const response = await axios.get(
      "https://psgc.gitlab.io/api/cities-municipalities"
    );
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error("Error in getProvinces service:", error);
    throw error;
  }
};

const getBarangays = async () => {
  try {
    const response = await axios.get("https://psgc.gitlab.io/api/barangays");
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error("Error in getProvinces service:", error);
    throw error;
  }
};

module.exports = {
  getRegions,
  getProvinces,
  getCitiesAndMunicipalities,
  getBarangays,
};
