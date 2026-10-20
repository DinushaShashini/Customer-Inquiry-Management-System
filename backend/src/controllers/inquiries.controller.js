import { InquiriesService } from "../services/inquiries.service.js";

export class InquiriesController {
  static async create(req, res, next) {
    try {
      const inquiry = await InquiriesService.createInquiry(req.body);
      res.status(201).json({
        status: "success",
        message: "Inquiry submitted successfully",
        data: inquiry
      });
    } catch (err) {
      next(err);
    }
  }

  static async list(req, res, next) {
    try {
      const result = await InquiriesService.listInquiries(req.query);
      res.status(200).json({
        status: "success",
        ...result
      });
    } catch (err) {
      next(err);
    }
  }

  static async getById(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      const inquiry = await InquiriesService.getInquiryById(id);
      res.status(200).json({
        status: "success",
        data: inquiry
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateStatus(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      const updated = await InquiriesService.updateStatus(id, req.body, req.user);
      res.status(200).json({
        status: "success",
        message: "Inquiry status updated successfully",
        data: updated
      });
    } catch (err) {
      next(err);
    }
  }
}
