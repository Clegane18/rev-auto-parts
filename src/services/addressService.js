const Address = require("../database/models/Address");

const addAddress = async ({
  customerId,
  fullName,
  region,
  province,
  city,
  barangay,
  postalCode,
  streetName,
  building,
  houseNumber,
  label,
  isSetDefaultAddress,
}) => {
  try {
    const newAddress = await Address.create({
      customerId: customerId,
      fullName: fullName,
      region: region,
      province: province,
      city: city,
      barangay: barangay,
      postalCode: postalCode,
      streetName: streetName,
      building: building,
      houseNumber: houseNumber,
      label: label,
      isSetDefaultAddress: isSetDefaultAddress,
    });
    return {
      status: 200,
      message: "Address added successfully",
      address: newAddress,
    };
  } catch (error) {
    console.error("Error in addAddress service:", error);
    throw error;
  }
};

const updateAddressById = async ({
  addressId,
  customerId,
  fullName,
  region,
  province,
  city,
  barangay,
  postalCode,
  streetName,
  building,
  houseNumber,
  label,
  isSetDefaultAddress,
}) => {
  try {
    const address = await Address.findByPk(addressId);

    if (!address) {
      throw {
        status: 404,
        data: { message: `Address not found with ID: ${addressId}` },
      };
    }

    if (address.customerId !== customerId) {
      throw {
        status: 403,
        data: {
          message:
            "Unauthorized: Address does not belong to the specified customer.",
        },
      };
    }

    const updates = {
      fullName,
      region,
      province,
      city,
      barangay,
      postalCode,
      streetName,
      building,
      houseNumber,
      label,
      isSetDefaultAddress,
    };

    let updated = false;

    Object.keys(updates).forEach((key) => {
      if (updates[key] !== undefined && updates[key] !== "") {
        address[key] = updates[key];
        updated = true;
      }
    });

    if (!updated) {
      throw {
        status: 400,
        data: { message: "At least one piece of information must be updated." },
      };
    }

    await address.save();

    return {
      status: 200,
      message: `Address with ID ${addressId} updated successfully.`,
      updatedAddress: address,
    };
  } catch (error) {
    console.error("Error in updateAddressById service:", error);
    throw error;
  }
};

module.exports = {
  addAddress,
  updateAddressById,
};
