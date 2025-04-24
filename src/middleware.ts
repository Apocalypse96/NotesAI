import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  try {
    // Refresh session if expired
    await supabase.auth.getSession();

    // Check if the user is authenticated
    const {
      data: { session },
    } = await supabase.auth.getSession();

    console.log("Middleware - Current path:", req.nextUrl.pathname);
    console.log("Middleware - Session exists:", !!session);

    // Protected routes that require authentication
    const protectedRoutes = ["/notes", "/profile"];
    const isProtectedRoute = protectedRoutes.some((route) =>
      req.nextUrl.pathname.startsWith(route)
    );

    // Auth routes that should redirect to home if already logged in
    const authRoutes = ["/login", "/signup"];
    const isAuthRoute = authRoutes.some((route) =>
      req.nextUrl.pathname.startsWith(route)
    );

    // Redirect if accessing protected route without authentication
    if (isProtectedRoute && !session) {
      console.log("Middleware - Redirecting to login from protected route");
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Redirect if accessing auth routes while already authenticated
    if (isAuthRoute && session) {
      console.log("Middleware - Redirecting to notes from auth route");
      return NextResponse.redirect(new URL("/notes", req.url));
    }
  } catch (error) {
    console.error("Middleware error:", error);
  }

  return res;
}

// Only run middleware on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
