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

module.exports = { isWithinMetroManila };
