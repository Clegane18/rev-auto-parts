const Address = require("../database/models/addressModel");
const { isWithinMetroManila } = require("../utils/addressUtils");

const addAddress = async ({
  customerId,
  phoneNumber,
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
    const existingAddresses = await Address.findAll({
      where: { customerId },
    });

    if (existingAddresses.length === 0) {
      isSetDefaultAddress = true;
    }

    if (isSetDefaultAddress == true) {
      await Address.update(
        { isSetDefaultAddress: false },
        {
          where: {
            customerId,
            isSetDefaultAddress: true,
          },
        }
      );
    }

    const isMetroManila = isWithinMetroManila(region, city);

    const newAddress = await Address.create({
      customerId,
      phoneNumber,
      fullName,
      region,
      province,
      city,
      barangay,
      postalCode,
      addressLine,
      label,
      isSetDefaultAddress,
      isWithinMetroManila: isMetroManila,
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
  phoneNumber,
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
      phoneNumber,
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

const setDefaultAddress = async ({ customerId, addressId }) => {
  try {
    await Address.update(
      { isSetDefaultAddress: false },
      { where: { customerId } }
    );

    await Address.update(
      { isSetDefaultAddress: true },
      { where: { id: addressId, customerId } }
    );

    return {
      status: 200,
      message: "Default address updated successfully",
    };
  } catch (error) {
    console.error("Error in setDefaultAddress service:", error);
    throw error;
  }
};

const getAddressById = async ({ addressId, customerId }) => {
  try {
    const address = await Address.findOne({
      where: { id: addressId },
    });

    if (!address) {
      return {
        status: 404,
        message: "Address not found",
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

    return {
      status: 200,
      data: address,
    };
  } catch (error) {
    console.error("Error in getAddressById service:", error);
    throw error;
  }
};

module.exports = {
  addAddress,
  updateAddressById,
  deleteAddressById,
  getAddressesByCustomerId,
  setDefaultAddress,
  getAddressById,
};
