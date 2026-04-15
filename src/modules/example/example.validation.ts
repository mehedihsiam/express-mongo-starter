import Joi from "joi";

export const createExampleSchema = Joi.object({
  name: Joi.string().required().trim().messages({
    "string.empty": "Name is required",
    "any.required": "Name is required",
  }),
  description: Joi.string().optional().trim(),
  isActive: Joi.boolean().optional().default(true),
});

export const updateExampleSchema = Joi.object({
  name: Joi.string().optional().trim(),
  description: Joi.string().optional().trim(),
  isActive: Joi.boolean().optional(),
});
