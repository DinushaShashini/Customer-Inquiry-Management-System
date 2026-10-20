import { AppError } from "../utils/AppError.js";

export function validate(schema, source = "body") {
  return (req, _res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const formattedErrors = result.error.errors.map((err) => ({
        path: err.path.join("."),
        message: err.message
      }));
      return next(new AppError("Validation failed", 400, formattedErrors));
    }
    req[source] = result.data;
    next();
  };
}
