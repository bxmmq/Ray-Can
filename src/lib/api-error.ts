export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, code: string = "INTERNAL_ERROR") {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = "Bad Request") {
    super(message, 400, "BAD_REQUEST");
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden") {
    super(message, 403, "FORBIDDEN");
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Not Found") {
    super(message, 404, "NOT_FOUND");
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Conflict") {
    super(message, 409, "CONFLICT");
  }
}

export class ValidationError extends AppError {
  public errors: Record<string, string[]>;

  constructor(message: string = "Validation Error", errors: Record<string, string[]> = {}) {
    super(message, 422, "VALIDATION_ERROR");
    this.errors = errors;
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message: string = "Too Many Requests") {
    super(message, 429, "TOO_MANY_REQUESTS");
  }
}

export function handleApiError(error: unknown): Response {
  if (error instanceof AppError) {
    return Response.json(
      {
        success: false,
        error: {
          message: error.message,
          code: error.code,
          ...(error instanceof ValidationError && { errors: error.errors }),
        },
      },
      { status: error.statusCode }
    );
  }

  console.error("Unhandled API error:", error);

  return Response.json(
    {
      success: false,
      error: {
        message: "เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง",
        code: "INTERNAL_ERROR",
      },
    },
    { status: 500 }
  );
}

export function errorResponse(message: string, code: string = "ERROR", statusCode: number = 400): Response {
  return Response.json(
    {
      success: false,
      error: { message, code },
    },
    { status: statusCode }
  );
}

export function successResponse<T>(data: T, message?: string): Response {
  return Response.json(
    {
      success: true,
      ...(message && { message }),
      data,
    },
    { status: 200 }
  );
}

export function createdResponse<T>(data: T, message?: string): Response {
  return Response.json(
    {
      success: true,
      ...(message && { message }),
      data,
    },
    { status: 201 }
  );
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, "");
}

export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}
