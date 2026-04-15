import { Router } from "express";
import {
  getAllExamples,
  getExampleById,
  createExample,
  updateExample,
  deleteExample,
} from "./example.controller";
import { validateWithJoi } from "../../utils/validationMiddleware";
import { createExampleSchema, updateExampleSchema } from "./example.validation";

const router = Router();

router.get("/", getAllExamples);
router.get("/:id", getExampleById);
router.post("/", validateWithJoi(createExampleSchema), createExample);
router.put("/:id", validateWithJoi(updateExampleSchema), updateExample);
router.delete("/:id", deleteExample);

export default router;
