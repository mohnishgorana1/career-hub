import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/", 
  "/sign-in",
  "/sign-up",
]);

export default clerkMiddleware((auth, req) => {
  const { userId } = auth();

  const currentUrl = new URL(req.url);

  const isAccessingHomePage = currentUrl.pathname === "/";

  // logged in and your trying to access publicRoute
  // but not accessingHomePage that means your accessing sign-in or sign-up so go to home page
  if (userId && isPublicRoute(req) && !isAccessingHomePage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // not logged in
  if (!userId) {
    // if user is not logged in and trying to access a protected route
    if (!isPublicRoute(req)) {
      return NextResponse.redirect(new URL("/sign-up", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"], // This ensures it matches all routes except for static files
};

