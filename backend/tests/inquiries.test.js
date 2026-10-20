import request from "supertest";
import app from "../src/app.js";
import { InquiriesService } from "../src/services/inquiries.service.js";

describe("Backend API & Inquiries Tests", () => {
  describe("GET /health", () => {
    it("should return 200 and healthy status payload", async () => {
      const res = await request(app).get("/health");
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("ok");
      expect(res.body).toHaveProperty("uptime");
      expect(res.body).toHaveProperty("timestamp");
    });
  });

  describe("Validation & Authentication Middleware", () => {
    it("should return 401 when accessing protected inquiries endpoint without auth", async () => {
      const res = await request(app).get("/api/inquiries");
      expect(res.status).toBe(401);
      expect(res.body.status).toBe("fail");
      expect(res.body.message).toContain("Authentication required");
    });

    it("should return 400 when submitting invalid inquiry data", async () => {
      const res = await request(app).post("/api/inquiries").send({
        customer_name: "A", // too short (min 2)
        customer_email: "not-an-email",
        subject: "Hi", // too short (min 3)
        message: "Short" // too short (min 10)
      });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("fail");
      expect(res.body.details).toBeInstanceOf(Array);
      expect(res.body.details.length).toBeGreaterThan(0);
    });
  });

  describe("InquiriesService State Transitions", () => {
    it("should permit valid status transitions", () => {
      expect(() => InquiriesService.validateStatusTransition("NEW", "IN_PROGRESS")).not.toThrow();
      expect(() => InquiriesService.validateStatusTransition("IN_PROGRESS", "RESOLVED")).not.toThrow();
      expect(() => InquiriesService.validateStatusTransition("RESOLVED", "CLOSED")).not.toThrow();
    });

    it("should reject invalid status transitions", () => {
      expect(() => InquiriesService.validateStatusTransition("NEW", "RESOLVED")).toThrow(
        "Invalid status transition"
      );
      expect(() => InquiriesService.validateStatusTransition("CLOSED", "RESOLVED")).toThrow(
        "Invalid status transition"
      );
    });
  });
});
