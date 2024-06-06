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

const returnProductValidation = (req, res, next) => {
  const { error } = returnProductSchema.validate({
    ...req.body,
    receiptNumber: req.params.receiptNumber,
  });
  if (error) return res.status(400).json({ error: error.details[0].message });

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

const createProductSchema = Joi.object({
  category: Joi.string().required().min(3),
  itemCode: Joi.string().required().min(3),
  brand: Joi.string().required().min(3),
  name: Joi.string().required().min(3),
  description: Joi.string().required().min(3).max(30),
  price: Joi.number().required().min(0),
  stock: Joi.number().integer().required().min(0),
  supplierName: Joi.string().required().min(3).max(15),
});

const updateProductSchema = Joi.object({
  category: Joi.string().min(3),
  itemCode: Joi.string().min(3),
  brand: Joi.string().min(3),
  name: Joi.string().min(3),
  description: Joi.string().min(3).max(30),
  price: Joi.number().min(0),
  stock: Joi.number().integer().min(0),
  supplierName: Joi.string().min(3).max(15),
});

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

const returnProductSchema = Joi.object({
  receiptNumber: Joi.string().required(),
  productIdToReturn: Joi.number().integer().min(1).required(),
  quantityToReturn: Joi.number().integer().min(1).required(),
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

module.exports = {
  createProductValidation,
  updateProductValidation,
  buyProductsOnPhysicalStoreValidation,
  returnProductValidation,
  addPendingStockValidation,
  confirmStockValidation,
  cancelStockValidation,
};
