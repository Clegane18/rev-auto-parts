const Joi = require("joi");

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
  const file = req.file;

  const { error } = uploadProductPhotoSchema.validate({
    file: {
      originalname: file?.originalname,
      mimetype: file?.mimetype,
      size: file?.size,
    },
    productId: parseInt(productId, 10),
  });

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
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

const createProductSchema = Joi.object({
  category: Joi.string().required().min(3),
  itemCode: Joi.string().required().min(3),
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
  productId: Joi.number().integer().required(),
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
  username: Joi.string().min(3).optional(),
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
};
