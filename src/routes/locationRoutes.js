const express = require("express");
const router = express.Router();
const locationController = require("../controllers/locationController");

router.get("/locations/regions", locationController.getRegions);
router.get(
  "/locations/provinces-or-cities",
  locationController.getProvincesOrCities
);
router.get(
  "/locations/cities-municipalities",
  locationController.getCitiesAndMunicipalities
);
router.get("/locations/barangays", locationController.getBarangays);

module.exports = router;
