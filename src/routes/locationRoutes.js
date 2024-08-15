const express = require("express");
const router = express.Router();
const errorHandler = require("../middlewares/errorHandler");
const locationController = require("../controllers/locationController");

router.get("/locations/regions", locationController.getRegions);
router.get("/locations/provinces", locationController.getProvinces);
router.get(
  "/locations/cities-municipalities",
  locationController.getCitiesAndMunicipalities
);
router.get("/locations/barangays", locationController.getBarangays);

router.use(errorHandler);

module.exports = router;
