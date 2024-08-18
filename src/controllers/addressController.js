const addressService = require("../services/addressService");

const addAddress = async (req, res) => {
  try {
    const result = await addressService.addAddress({
      customerId: req.params.id,
      phoneNumber: req.body.phoneNumber,
      fullName: req.body.fullName,
      region: req.body.region,
      province: req.body.province,
      city: req.body.city,
      barangay: req.body.barangay,
      postalCode: req.body.postalCode,
      addressLine: req.body.addressLine,
      label: req.body.label,
      isSetDefaultAddress: req.body.isSetDefaultAddress,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error creating new address:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const updateAddress = async (req, res) => {
  try {
    const result = await addressService.updateAddressById({
      addressId: req.params.addressId,
      customerId: req.user.id,
      phoneNumber: req.body.phoneNumber,
      fullName: req.body.fullName,
      region: req.body.region,
      province: req.body.province,
      city: req.body.city,
      barangay: req.body.barangay,
      postalCode: req.body.postalCode,
      addressLine: req.body.addressLine,
      label: req.body.label,
      isSetDefaultAddress: req.body.isSetDefaultAddress,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error updating address:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const result = await addressService.deleteAddressById({
      addressId: parseInt(req.params.addressId),
      customerId: req.user.id,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error deleting address:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const getAddressesByCustomerId = async (req, res) => {
  try {
    const result = await addressService.getAddressesByCustomerId(req.user.id);
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

module.exports = {
  addAddress,
  updateAddress,
  deleteAddress,
  getAddressesByCustomerId,
};
