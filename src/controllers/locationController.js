const locationService = require("../services/locationService");

const getRegions = async (req, res) => {
  try {
    const result = await locationService.getRegions();
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error fetching regions:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const getProvincesOrCities = async (req, res) => {
  try {
    const { regionCode } = req.query;
    const result = await locationService.getProvincesOrCities(regionCode);
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error fetching provinces or cities:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const getCitiesAndMunicipalities = async (req, res) => {
  try {
    const { provinceOrCityCode } = req.query;
    const result = await locationService.getCitiesAndMunicipalities(
      provinceOrCityCode
    );
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error fetching cities and municipalities:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const getBarangays = async (req, res) => {
  try {
    const { municipalityOrCityCode, regionCode } = req.query;
    const result = await locationService.getBarangays(
      municipalityOrCityCode,
      regionCode
    );
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error fetching barangays:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

module.exports = {
  getRegions,
  getProvincesOrCities,
  getCitiesAndMunicipalities,
  getBarangays,
};
