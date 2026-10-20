import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";

export class AuthController {
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw new AppError("Email and password are required", 400);
      }

      const userRes = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
      const user = userRes.rows[0];

      if (!user) {
        throw new AppError("Invalid email or password", 401);
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        throw new AppError("Invalid email or password", 401);
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name, role: user.role },
        env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.status(200).json({
        status: "success",
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          },
          token
        }
      });
    } catch (err) {
      next(err);
    }
  }

  static async logout(_req, res) {
    res.clearCookie("token");
    res.status(200).json({ status: "success", message: "Logged out successfully" });
  }

  static async me(req, res) {
    res.status(200).json({ status: "success", data: { user: req.user } });
  }
}
