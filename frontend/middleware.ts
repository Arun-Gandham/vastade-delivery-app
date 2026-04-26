import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isPublicRoute } from "@/config/routes.config";
import { authCookieNames } from "@/lib/auth/cookies";
import { canAccessPath } from "@/lib/auth/route-access";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/_next") || pathname.includes(".")) {
    return NextResponse.next();
  }

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get(authCookieNames.accessToken)?.value;
  const role = request.cookies.get(authCookieNames.role)?.value as
    | "SUPER_ADMIN"
    | "ADMIN"
    | "SHOP_OWNER"
    | "STORE_MANAGER"
    | "CUSTOMER"
    | "CAPTAIN"
    | undefined;

  const protectedPath = ["/customer", "/captain", "/shop-owner", "/admin", "/super-admin"].some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (protectedPath && !accessToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (protectedPath && !canAccessPath(pathname, role)) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
