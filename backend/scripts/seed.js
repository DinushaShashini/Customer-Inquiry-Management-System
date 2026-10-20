import bcrypt from "bcryptjs";
import { pool } from "../src/config/db.js";

async function runSeed() {
  console.log("Seeding database...");
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Insert demo user
    const passwordHash = await bcrypt.hash("Password123!", 10);
    const userRes = await client.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
       RETURNING id`,
      ["Support Agent", "agent@example.com", passwordHash, "agent"]
    );
    const agentId = userRes.rows[0].id;

    // Insert sample inquiries
    const inquiries = [
      {
        customer_name: "Alice Johnson",
        customer_email: "alice@example.com",
        customer_phone: "+1 555-0101",
        subject: "Invoice query for March subscription",
        message: "Hi, I noticed an unexpected charge on my latest invoice for March. Could you please clarify?",
        category: "BILLING",
        priority: "HIGH",
        status: "NEW",
        assigned_to: agentId
      },
      {
        customer_name: "Bob Smith",
        customer_email: "bob@techsolutions.com",
        customer_phone: "+1 555-0102",
        subject: "API Authentication 401 error",
        message: "We are receiving 401 Unauthorized errors when generating new API tokens from the dashboard.",
        category: "TECHNICAL",
        priority: "URGENT",
        status: "IN_PROGRESS",
        assigned_to: agentId
      },
      {
        customer_name: "Clara Garcia",
        customer_email: "clara@designstudio.io",
        customer_phone: "+1 555-0103",
        subject: "Bulk license inquiry for enterprise",
        message: "Our team is scaling up to 50 seats next month and we'd like to discuss enterprise volume tiers.",
        category: "SALES",
        priority: "MEDIUM",
        status: "RESOLVED",
        assigned_to: agentId
      }
    ];

    for (const inq of inquiries) {
      await client.query(
        `INSERT INTO inquiries 
          (customer_name, customer_email, customer_phone, subject, message, category, priority, status, assigned_to)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          inq.customer_name,
          inq.customer_email,
          inq.customer_phone,
          inq.subject,
          inq.message,
          inq.category,
          inq.priority,
          inq.status,
          inq.assigned_to
        ]
      );
    }

    await client.query("COMMIT");
    console.log("Database seeded successfully.");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Seeding failed:", err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runSeed();
