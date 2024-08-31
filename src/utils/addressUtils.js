const axios = require("axios");
const turf = require("@turf/turf");

const ncrCities = [
  "City of Caloocan",
  "City of Las Piñas",
  "City of Makati",
  "City of Malabon",
  "City of Mandaluyong",
  "City of Manila",
  "City of Marikina",
  "City of Muntinlupa",
  "City of Navotas",
  "City of Paranaque",
  "City of Pasig",
  "City of San Juan",
  "City of Taguig",
  "City of Valenzuela",
  "Pasay City",
  "Pateros",
  "Quezon City",
];

const normalizeCityName = (cityName) => {
  return cityName
    .toLowerCase()
    .replace(/^city of\s+/, "")
    .trim();
};

const isWithinMetroManila = (region, city) => {
  const isMetroRegion = region.toLowerCase().includes("ncr");
  const normalizedCity = normalizeCityName(city);
  const isMetroCity = ncrCities.some(
    (metroCity) => normalizeCityName(metroCity) === normalizedCity
  );

  return isMetroRegion && isMetroCity;
};

// Function to convert an address to longitude and latitude using OpenStreetMap Nominatim API
const convertAddressToLongitudeAndLatitude = async (address) => {
  const encodedAddress = encodeURIComponent(address);
  const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&addressdetails=1`;

  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "G&F Auto Supply (johnross.rivera.m@bulsu.edu.ph)",
      },
    });
    if (response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
    } else {
      console.error("No results found for the given address.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching geocode:", error.message);
    return null;
  }
};

// Calculate coordinates and convert in KM
const calculateDistanceBetweenCoordinatesInKM = (coords1, coords2) => {
  const point1 = turf.point([coords1.longitude, coords1.latitude]);
  const point2 = turf.point([coords2.longitude, coords2.latitude]);

  const distance = turf.distance(point1, point2, { units: "kilometers" });

  return distance;
};

const constructFullAddress = ({ barangay, city, province, region }) => {
  let fullAddress;

  city = city.replace(/^City of\s+/i, "").trim();

  if (
    region.toUpperCase() === "NCR" ||
    region.toUpperCase().includes("METRO MANILA")
  ) {
    fullAddress = `${barangay}, ${city}, Metro Manila, Philippines`;
  } else {
    fullAddress = `${barangay}, ${city}, ${province}, ${region}, Philippines`;
  }

  return fullAddress;
};

module.exports = {
  isWithinMetroManila,
  convertAddressToLongitudeAndLatitude,
  calculateDistanceBetweenCoordinatesInKM,
  constructFullAddress,
};
