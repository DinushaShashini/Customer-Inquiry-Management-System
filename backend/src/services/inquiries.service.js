import { pool } from "../config/db.js";
import { AppError } from "../utils/AppError.js";

// Valid state machine transitions
const ALLOWED_TRANSITIONS = {
  NEW: ["IN_PROGRESS", "CLOSED"],
  IN_PROGRESS: ["RESOLVED", "CLOSED", "NEW"],
  RESOLVED: ["CLOSED", "IN_PROGRESS"],
  CLOSED: ["IN_PROGRESS"]
};

export class InquiriesService {
  /**
   * Check for duplicate inquiry within 24 hours
   */
  static async checkDuplicate(customerEmail, subject) {
    const query = `
      SELECT id, status, created_at 
      FROM inquiries 
      WHERE customer_email = $1 
        AND LOWER(subject) = LOWER($2)
        AND status IN ('NEW', 'IN_PROGRESS')
        AND created_at >= NOW() - INTERVAL '24 hours'
      LIMIT 1
    `;
    const res = await pool.query(query, [customerEmail, subject]);
    return res.rows[0] || null;
  }

  /**
   * Validate whether a status transition is permitted
   */
  static validateStatusTransition(currentStatus, newStatus) {
    if (currentStatus === newStatus) return true;
    const allowed = ALLOWED_TRANSITIONS[currentStatus] || [];
    if (!allowed.includes(newStatus)) {
      throw new AppError(
        `Invalid status transition from '${currentStatus}' to '${newStatus}'. Allowed: ${allowed.join(", ") || "none"}`,
        400
      );
    }
    return true;
  }

  /**
   * Create a new inquiry with duplicate check
   */
  static async createInquiry(data) {
    const duplicate = await this.checkDuplicate(data.customer_email, data.subject);
    if (duplicate) {
      throw new AppError(
        `A similar open inquiry (#${duplicate.id}) from this customer was submitted within the last 24 hours.`,
        409,
        { duplicateId: duplicate.id }
      );
    }

    const query = `
      INSERT INTO inquiries 
        (customer_name, customer_email, customer_phone, subject, message, category, priority, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'NEW')
      RETURNING *
    `;
    const values = [
      data.customer_name,
      data.customer_email,
      data.customer_phone || null,
      data.subject,
      data.message,
      data.category,
      data.priority
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * List inquiries with filtering, search and pagination
   */
  static async listInquiries({ page = 1, limit = 10, search, status, category, priority }) {
    const offset = (page - 1) * limit;
    const conditions = [];
    const values = [];

    if (search && search.trim() !== "") {
      values.push(`%${search.trim()}%`);
      const idx = values.length;
      conditions.push(
        `(customer_name ILIKE $${idx} OR customer_email ILIKE $${idx} OR subject ILIKE $${idx} OR message ILIKE $${idx})`
      );
    }

    if (status && status !== "ALL") {
      values.push(status);
      conditions.push(`status = $${values.length}`);
    }

    if (category && category !== "ALL") {
      values.push(category);
      conditions.push(`category = $${values.length}`);
    }

    if (priority && priority !== "ALL") {
      values.push(priority);
      conditions.push(`priority = $${values.length}`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const countQuery = `SELECT COUNT(*) AS total FROM inquiries ${whereClause}`;
    const countRes = await pool.query(countQuery, values);
    const total = parseInt(countRes.rows[0].total, 10);

    const dataQuery = `
      SELECT i.*, u.name as assigned_agent_name 
      FROM inquiries i
      LEFT JOIN users u ON i.assigned_to = u.id
      ${whereClause}
      ORDER BY i.created_at DESC
      LIMIT $${values.length + 1} OFFSET $${values.length + 2}
    `;

    const dataRes = await pool.query(dataQuery, [...values, limit, offset]);

    return {
      data: dataRes.rows,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1
      }
    };
  }

  /**
   * Get single inquiry by ID
   */
  static async getInquiryById(id) {
    const query = `
      SELECT i.*, u.name as assigned_agent_name, u.email as assigned_agent_email
      FROM inquiries i
      LEFT JOIN users u ON i.assigned_to = u.id
      WHERE i.id = $1
    `;
    const res = await pool.query(query, [id]);
    if (!res.rows[0]) {
      throw new AppError(`Inquiry #${id} not found`, 404);
    }
    return res.rows[0];
  }

  /**
   * Update inquiry status and assignment
   */
  static async updateStatus(id, { status, notes, assigned_to }, user) {
    const current = await this.getInquiryById(id);

    if (status && status !== current.status) {
      this.validateStatusTransition(current.status, status);
    }

    const newStatus = status || current.status;
    const newNotes = notes !== undefined ? notes : current.notes;
    const newAssignee = assigned_to !== undefined ? assigned_to : current.assigned_to;

    const query = `
      UPDATE inquiries
      SET status = $1, notes = $2, assigned_to = $3, updated_at = NOW()
      WHERE id = $4
      RETURNING *
    `;

    const res = await pool.query(query, [newStatus, newNotes, newAssignee, id]);
    return res.rows[0];
  }
}
