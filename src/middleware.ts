import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Extract the user role from the JWT.
function getUserRoleFromToken(token: string): string | null {
  try {
    // Decode the JWT payload using base64url.
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role || null;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  // Get the current URL path.
  const { pathname } = request.nextUrl;

  // Read the authentication tokens from cookies.
  const authToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // Users without either token may access only landing, sign-in, and sign-up paths.
  if (!authToken && !refreshToken) {
    const allowedPaths = ["/", "/signin"];
    const isSignupPath = pathname === "/signup" || pathname.startsWith("/signup/");
    const isAllowed = allowedPaths.includes(pathname) || isSignupPath;
    if (!isAllowed) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  }

  // Extract the user role from the access token.
  const userRole = authToken ? getUserRoleFromToken(authToken) : null;

  // The cookie and token expire together, so token presence represents authentication here.
  const isAuthenticated = !!authToken;

  // Route groups do not affect the /signin and /signup URLs.
  const authPaths = ["/signin", "/signup"];
  const isAuthRoute = authPaths.some((path) => pathname === path);

  // Handle authenticated users visiting sign-in or sign-up pages.
  if (isAuthRoute && isAuthenticated) {
    // Redirect authenticated users to the main page.
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Allow protected paths without an access token so automatic refresh can run.

  // Apply role-based access control only to authenticated users.
  if (isAuthenticated && userRole) {
    // Paths available only to SUPER_ADMIN users.
    const superAdminOnlyPaths = ["/manage/users", "/manage/budgets"];

    // Block USER and ADMIN roles from SUPER_ADMIN-only paths.
    const isSuperAdminOnly = superAdminOnlyPaths.some((path) => pathname === path || pathname.startsWith(path + "/"));
    if ((userRole === "USER" || userRole === "ADMIN") && isSuperAdminOnly) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    // Paths unavailable to USER accounts, excluding SUPER_ADMIN-only paths.
    const userRestrictedPaths = [
      "/order-manage", // Purchase request management
      "/order-history", // Purchase history
      "/payments",
    ];
    const isUserRestricted = userRestrictedPaths.some((path) => pathname === path || pathname.startsWith(path + "/"));
    if (userRole === "USER" && isUserRestricted) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    // Prevent non-USER accounts from accessing the cart checkout.
    const nonUserRestrictedPaths = [
      "/cart/order", // Cart checkout
    ];
    const isNonUserRestricted = nonUserRestrictedPaths.some(
      (path) => pathname === path || pathname.startsWith(path + "/"),
    );
    if (userRole !== "USER" && isNonUserRestricted) {
      return NextResponse.redirect(new URL("/unauthorized?from=order", request.url));
    }
  }

  // Redirect authenticated users from "/" to "/products".
  if (pathname === "/" && isAuthenticated) {
    return NextResponse.redirect(new URL("/products", request.url));
  }

  // Continue for all other requests.
  return NextResponse.next();
}

// Define the paths where middleware runs.
export const config = {
  matcher: [
    // Exclude API routes and static files.
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
