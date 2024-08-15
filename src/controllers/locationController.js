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

const getProvinces = async (req, res) => {
  try {
    const { regionCode } = req.query;
    const result = await locationService.getProvinces(regionCode);
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error fetching provinces:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const getCitiesAndMunicipalities = async (req, res) => {
  try {
    const { provinceCode } = req.query;
    const result = await locationService.getCitiesAndMunicipalities(
      provinceCode
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
    const { municipalityCode } = req.query;
    const result = await locationService.getBarangays(municipalityCode);
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
  getProvinces,
  getCitiesAndMunicipalities,
  getBarangays,
};
