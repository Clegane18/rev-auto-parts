const Address = require("../database/models/addressModel");
const Customer = require("../database/models/customerModel");

const addAddress = async ({
  customerId,
  fullName,
  region,
  province,
  city,
  barangay,
  postalCode,
  addressLine,
  label,
  isSetDefaultAddress,
}) => {
  try {
    const existingAddress = await Address.findOne({
      where: { customerId },
    });

    if (!existingAddress) {
      isSetDefaultAddress = true;
    } else {
      isSetDefaultAddress = false;
    }

    const newAddress = await Address.create({
      customerId,
      fullName,
      region,
      province,
      city,
      barangay,
      postalCode,
      addressLine,
      label,
      isSetDefaultAddress,
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
  addressLine,
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
      addressLine,
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

const deleteAddressById = async ({ addressId, customerId }) => {
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

    await address.destroy();

    return {
      status: 200,
      message: `Address with ID ${addressId} deleted successfully.`,
    };
  } catch (error) {
    console.error("Error in deleteAddressById service:", error);
    throw error;
  }
};

const getAddressesByCustomerId = async (customerId) => {
  try {
    const addresses = await Address.findAll({
      where: { customerId },
    });

    if (!addresses.length) {
      return {
        status: 404,
        data: {
          message: "You don't have addresses yet.",
        },
      };
    }

    return {
      status: 200,
      data: addresses,
    };
  } catch (error) {
    console.error("Error in getAddressesByCustomerId service:", error);
    throw error;
  }
};

module.exports = {
  addAddress,
  updateAddressById,
  deleteAddressById,
  getAddressesByCustomerId,
};
