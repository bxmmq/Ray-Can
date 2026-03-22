import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const AUTH_RATE_LIMIT = new Map<string, { count: number; timestamp: number }>();
const AUTH_WINDOW_MS = 15 * 60 * 1000;
const AUTH_MAX_REQUESTS = 5;

function isAuthRateLimited(key: string): boolean {
  const now = Date.now();
  const record = AUTH_RATE_LIMIT.get(key);

  if (!record || now - record.timestamp > AUTH_WINDOW_MS) {
    AUTH_RATE_LIMIT.set(key, { count: 1, timestamp: now });
    return false;
  }

  if (record.count >= AUTH_MAX_REQUESTS) {
    return true;
  }

  record.count++;
  return false;
}

export async function GET(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

  if (isAuthRateLimited(ip)) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: "Too many verification requests. Please try again in 15 minutes.",
          code: "RATE_LIMITED",
        },
      },
      { status: 429 }
    );
  }

  return NextResponse.next();
}

export async function POST(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

  if (isAuthRateLimited(ip)) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: "Too many login attempts. Please try again in 15 minutes.",
          code: "RATE_LIMITED",
        },
      },
      { status: 429 }
    );
  }

  return NextResponse.next();
}
