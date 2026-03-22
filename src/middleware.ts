import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/** Auth.js v5: cookie name + JWT salt depend on secure vs non-secure. Must match how Set-Cookie was issued (HTTPS → __Secure- prefix). */
function usesSecureSessionCookie(request: NextRequest): boolean {
  const forwarded = request.headers.get("x-forwarded-proto");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim().toLowerCase();
    if (first === "https" || first === "http") return first === "https";
  }
  return request.nextUrl.protocol === "https:";
}

function authSecret() {
  return process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
}

async function readSessionToken(request: NextRequest) {
  const secret = authSecret();
  if (!secret) return null;
  return getToken({
    req: request,
    secret,
    secureCookie: usesSecureSessionCookie(request),
  });
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Already signed in → don't show login/register forms (fixes navbar session vs form mismatch)
  if (pathname === "/login" || pathname === "/register") {
    const token = await readSessionToken(request);
    if (token) {
      if (pathname === "/login") {
        const cb = request.nextUrl.searchParams.get("callbackUrl");
        const safe =
          cb && cb.startsWith("/") && !cb.startsWith("//") ? cb : "/dashboard";
        return NextResponse.redirect(new URL(safe, request.url));
      }
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  const publicPaths = ["/", "/plans", "/privacy", "/terms", "/api/auth"];
  const isPublicPath = publicPaths.some(
    (path) =>
      pathname === path ||
      (path === "/plans" && pathname.startsWith("/plans")) ||
      pathname.startsWith("/api/auth")
  );

  // Public read access to plans API (storefront); mutations require auth in route handlers
  const isPublicPlansGet =
    request.method === "GET" && (pathname === "/api/plans" || pathname.startsWith("/api/plans/"));

  if (isPublicPath || isPublicPlansGet) {
    return NextResponse.next();
  }

  const token = await readSessionToken(request);

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/admin")) {
    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/order") || pathname.startsWith("/referral")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // ── ส่งต่อ cookie แบบ same-site ให้ client อ่าน session ได้ ──
  const response = NextResponse.next();

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
