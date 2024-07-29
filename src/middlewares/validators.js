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

const uploadProductPhotosValidation = (req, res, next) => {
  const { productId } = req.params;
  const productPhotos = req.files; // Assuming you use `upload.array` middleware

  // Validate the entire request object
  const { error } = uploadProductPhotosSchema.validate({
    productId: parseInt(productId, 10),
    productPhotos,
  });

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

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

const uploadProductPhotosSchema = Joi.object({
  productId: Joi.number().integer().required(),
  productPhotos: Joi.array()
    .items(
      Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string()
          .valid("image/jpeg", "image/png", "image/gif")
          .required(),
        destination: Joi.string().required(),
        filename: Joi.string().required(),
        path: Joi.string().required(),
        size: Joi.number()
          .max(10 * 1024 * 1024)
          .required(),
      }).unknown(true)
    )
    .max(5)
    .required(),
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
  uploadProductPhotosValidation,
};
