import { Router } from "express";
import { InquiriesController } from "../controllers/inquiries.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { validate } from "../middleware/validate.js";
import {
  createInquirySchema,
  updateStatusSchema,
  queryInquirySchema
} from "../schemas/inquiry.schema.js";

const router = Router();

// Create new inquiry (publicly accessible)
router.post("/", validate(createInquirySchema, "body"), InquiriesController.create);

// Authenticated agent/admin routes
router.get("/", requireAuth, validate(queryInquirySchema, "query"), InquiriesController.list);
router.get("/:id", requireAuth, InquiriesController.getById);
router.patch("/:id/status", requireAuth, validate(updateStatusSchema, "body"), InquiriesController.updateStatus);

export default router;
