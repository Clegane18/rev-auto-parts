const Joi = require("joi");
const Product = require("../database/models/inventoryProductModel");

const createProductValidation = (req, res, next) => {
  const { error } = createProductSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  next();
};

const updateProductValidation = (req, res, next) => {
  const { error } = updateProductSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  next();
};

const buyProductsOnPhysicalStoreValidation = (req, res, next) => {
  const { error } = buyProductsOnPhysicalStoreSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const addPendingStockValidation = (req, res, next) => {
  const { error } = addPendingStockSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  next();
};

const confirmStockValidation = (req, res, next) => {
  const { error } = confirmStockSchema.validate({ id: req.params.id });
  if (error) return res.status(400).json({ error: error.details[0].message });

  next();
};

const cancelStockValidation = (req, res, next) => {
  const { error } = cancelPendingStockSchema.validate({ id: req.params.id });
  if (error) return res.status(400).json({ error: error.details[0].message });

  next();
};

const updateArrivalDateValidation = (req, res, next) => {
  const { error } = updateArrivalDateSchema.validate({
    pendingStockId: req.params.id,
    newArrivalDate: req.body.newArrivalDate,
  });
  if (error) return res.status(400).json({ error: error.details[0].message });

  next();
};

const deleteProductByIdValidation = (req, res, next) => {
  const { error } = deleteProductByIdStockSchema.validate({
    productId: parseInt(req.params.productId, 10),
  });
  if (error) return res.status(400).json({ error: error.details[0].message });

  next();
};

const uploadProductPhotoValidation = (req, res, next) => {
  const { productId } = req.params;
  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }

  for (let file of files) {
    const { error } = uploadProductPhotoSchema.validate({
      file: {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      },
      productId: parseInt(productId, 10),
    });

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
  }

  next();
};

const unpublishedItemByIdValidation = (req, res, next) => {
  const { error } = unpublishItemByProductIdSchema.validate({
    productId: parseInt(req.params.productId, 10),
  });
  if (error) return res.status(400).json({ error: error.details[0].message });

  next();
};

const getProductByIdAndPublishValidation = (req, res, next) => {
  const { error } = getProductByIdAndPublishSchema.validate({
    productId: parseInt(req.params.productId, 10),
  });
  if (error) return res.status(400).json({ error: error.details[0].message });

  next();
};

const signUpValidation = (req, res, next) => {
  const { error } = signupSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  next();
};

const loginValidation = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  next();
};

const updateCustomerValidation = (req, res, next) => {
  const { error } = updateCustomerSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  next();
};

const addAddressValidation = (req, res, next) => {
  const { error } = addAddressSchema.validate({
    customerId: parseInt(req.params.id),
    ...req.body,
  });

  if (error) return res.status(400).json({ error: error.details[0].message });

  next();
};

const updateAddressValidation = (req, res, next) => {
  const { error } = updateAddressSchema.validate({
    addressId: parseInt(req.params.addressId),
    customerId: req.user.id,
    ...req.body,
  });

  if (error) return res.status(400).json({ error: error.details[0].message });

  next();
};

const deleteAddressValidation = (req, res, next) => {
  const { error } = deleteAddressSchema.validate({
    addressId: parseInt(req.params.addressId),
  });

  if (error) return res.status(400).json({ error: error.details[0].message });

  next();
};

const createOrderValidation = (req, res, next) => {
  const { error } = createOrderSchema.validate({
    customerId: req.user.id,
    addressId: req.params.addressId
      ? parseInt(req.params.addressId, 10)
      : undefined,
    items: req.body.items,
  });

  if (error) return res.status(400).json({ error: error.details[0].message });

  next();
};

const getOrdersByStatusValidation = (req, res, next) => {
  const { error } = getOrdersByStatusSchema.validate({
    status: req.query.status,
    customerId: parseInt(req.query.customerId, 10),
  });

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

const sendContactUsEmailValidation = (req, res, next) => {
  const { error } = sendContactUsEmailSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

const adminLogInValidation = (req, res, next) => {
  const { error } = adminLogInSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

const updateAdminEmailValidation = (req, res, next) => {
  const { error } = updateAdminEmailSchema.validate({
    adminId: req.params.adminId,
    newEmail: req.body.newEmail,
  });

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

const updateAdminPasswordValidation = (req, res, next) => {
  const { error } = updateAdminPasswordSchema.validate({
    adminId: req.params.adminId,
    newPassword: req.body.newPassword,
  });

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

const createProductSchema = Joi.object({
  category: Joi.string().required().min(3),
  itemCode: Joi.string().min(3).required(),
  brand: Joi.string().required().min(3),
  name: Joi.string().required().min(3),
  description: Joi.string().required().min(3),
  price: Joi.number().required().min(0),
  supplierCost: Joi.number().required().min(0).less(Joi.ref("price")).messages({
    "number.less": '"supplierCost" must be less than "price"',
  }),
  stock: Joi.number().integer().required().min(0),
  supplierName: Joi.string().required().min(3),
});

const updateProductSchema = Joi.object({
  category: Joi.string().min(3),
  itemCode: Joi.string().min(3),
  brand: Joi.string().min(3),
  name: Joi.string().min(3),
  description: Joi.string().required().min(3),
  price: Joi.number().min(0),
  supplierCost: Joi.number().required().min(0).less(Joi.ref("price")).messages({
    "number.less": '"supplierCost" must be less than "price"',
  }),
  supplierName: Joi.string().required().min(3),
}).unknown(true); // Allow unspecified fields

const buyProductsOnPhysicalStoreSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.number().integer().required(),
        quantity: Joi.number().integer().min(1).required(),
      })
    )
    .min(1)
    .required(),
  paymentAmount: Joi.number().positive().required(),
});

const addPendingStockSchema = Joi.object({
  productName: Joi.string().min(3).required(),
  quantity: Joi.number().integer().min(1).required(),
  arrivalDate: Joi.string()
    .pattern(/^(\d{4})-(\d{2})-(\d{2})$/)
    .required(),
  status: Joi.string()
    .valid("pending", "confirmed", "cancelled")
    .default("pending"),
});

const confirmStockSchema = Joi.object({
  id: Joi.number().integer().required(),
});

const cancelPendingStockSchema = Joi.object({
  id: Joi.number().integer().required(),
});

const updateArrivalDateSchema = Joi.object({
  pendingStockId: Joi.number().integer().required(),
  newArrivalDate: Joi.string()
    .pattern(/^(\d{4})-(\d{2})-(\d{2})$/)
    .required(),
});

const deleteProductByIdStockSchema = Joi.object({
  productId: Joi.number().integer().required(),
});

const uploadProductPhotoSchema = Joi.object({
  file: Joi.object({
    originalname: Joi.string().required(),
    mimetype: Joi.string()
      .valid("image/jpeg", "image/jpg", "image/png", "image/gif")
      .required(),
    size: Joi.number()
      .max(5 * 1024 * 1024)
      .required(),
  }).required(),
  productId: Joi.number().integer().positive().required(),
});

const unpublishItemByProductIdSchema = Joi.object({
  productId: Joi.number().integer().required(),
});

const getProductByIdAndPublishSchema = Joi.object({
  productId: Joi.number().integer().required(),
});

const signupSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().max(30).required(),
  password: Joi.string().min(6).max(30).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().max(30).required(),
  password: Joi.string().min(6).max(30).required(),
});

const updateCustomerSchema = Joi.object({
  username: Joi.string().min(3).optional().allow(null, ""),
  phoneNumber: Joi.string()
    .pattern(/^\+63[0-9]{10}$/)
    .optional()
    .allow(null, "")
    .messages({
      "string.pattern.base":
        '"phoneNumber" must start with "+63" followed by 10 digits',
    }),

  gender: Joi.string()
    .valid("Male", "Female", "Other")
    .optional()
    .allow(null, ""),
  dateOfBirth: Joi.date()
    .iso()
    .optional()
    .messages({
      "date.format":
        '"dateOfBirth" must be a valid date in ISO format (YYYY-MM-DD)',
    })
    .allow(null, ""),
}).unknown(true);

const addAddressSchema = Joi.object({
  customerId: Joi.number().integer().positive().required(),
  fullName: Joi.string().min(3).optional().allow(null, ""),
  phoneNumber: Joi.string()
    .required()
    .messages({
      "string.base": "Phone number must be a string of digits.",
      "string.empty": "Phone number cannot be empty.",
      "any.required": "Phone number is required.",
    })
    .pattern(/^\d+$/)
    .messages({
      "string.pattern.base": "Phone number must contain only digits.",
    })
    .min(11)
    .max(12)
    .messages({
      "string.min": "Phone number must be at least 10 digits long.",
      "string.max": "Phone number must be at most 12 digits long.",
    }),
  region: Joi.string().optional().allow(null, ""),
  province: Joi.string().optional().allow(null, ""),
  city: Joi.string().optional().allow(null, ""),
  barangay: Joi.string().optional().allow(null, ""),
  postalCode: Joi.string().optional().allow(null, ""),
  addressLine: Joi.string().optional().allow(null, ""),
  label: Joi.string().valid("Home", "Work").optional().allow(null, ""),
  isSetDefaultAddress: Joi.boolean().optional().allow(null),
}).unknown(true);

const updateAddressSchema = Joi.object({
  addressId: Joi.number().integer().positive().required(),
  customerId: Joi.number().integer().positive().required(),
  fullName: Joi.string().min(3).optional().allow(null, ""),
  region: Joi.string().optional().allow(null, ""),
  province: Joi.string().optional().allow(null, ""),
  city: Joi.string().optional().allow(null, ""),
  barangay: Joi.string().optional().allow(null, ""),
  postalCode: Joi.string().optional().allow(null, ""),
  streetName: Joi.string().optional().allow(null, ""),
  building: Joi.string().optional().allow(null, ""),
  houseNumber: Joi.string().optional().allow(null, ""),
  label: Joi.string().optional().allow(null, ""),
  isSetDefaultAddress: Joi.boolean().optional().allow(null),
}).unknown(true);

const deleteAddressSchema = Joi.object({
  addressId: Joi.number().integer().positive().required(),
}).unknown(true);

const createOrderSchema = Joi.object({
  customerId: Joi.number().integer().positive().required(),
  addressId: Joi.number().integer().positive().optional(),
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.number().integer().positive().required(),
        quantity: Joi.number().integer().positive().required(),
      })
    )
    .min(1)
    .required(),
}).unknown(true);

const allowedStatuses = [
  "All",
  "To Pay",
  "To Ship",
  "To Receive",
  "Completed",
  "Cancelled",
];

const getOrdersByStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...allowedStatuses)
    .optional(),
  customerId: Joi.number().integer().positive().required(),
});

const sendContactUsEmailSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(11).max(12).required(),
  message: Joi.string().min(10).max(500).required(),
});

const adminLogInSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format.",
    "any.required": "Email is required.",
  }),
  password: Joi.string().min(8).max(50).required().messages({
    "string.min": "Password should have a minimum length of 8 characters.",
    "any.required": "Password is required.",
  }),
});

const updateAdminEmailSchema = Joi.object({
  adminId: Joi.number().integer().required().messages({
    "number.base": "Admin ID must be a valid number.",
    "any.required": "Admin ID is required.",
  }),
  newEmail: Joi.string().email().required().messages({
    "string.email": "Invalid email format.",
    "any.required": "New email is required.",
  }),
});

const updateAdminPasswordSchema = Joi.object({
  adminId: Joi.number().integer().required().messages({
    "number.base": "Admin ID must be a valid number.",
    "any.required": "Admin ID is required.",
  }),
  newPassword: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$"
      )
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must have at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.",
      "any.required": "New password is required.",
    }),
});

module.exports = {
  createProductValidation,
  updateProductValidation,
  buyProductsOnPhysicalStoreValidation,
  addPendingStockValidation,
  confirmStockValidation,
  cancelStockValidation,
  updateArrivalDateValidation,
  deleteProductByIdValidation,
  uploadProductPhotoValidation,
  unpublishedItemByIdValidation,
  getProductByIdAndPublishValidation,
  signUpValidation,
  loginValidation,
  updateCustomerValidation,
  addAddressValidation,
  updateAddressValidation,
  deleteAddressValidation,
  createOrderValidation,
  getOrdersByStatusValidation,
  sendContactUsEmailValidation,
  adminLogInValidation,
  updateAdminEmailValidation,
  updateAdminPasswordValidation,
};
