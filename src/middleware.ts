import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;

    if (req.nextUrl.pathname.startsWith("/app")) {
      if (token?.role !== "student") {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    if (req.nextUrl.pathname.startsWith("/staff")) {
      if (token?.role !== "staff") {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, 
    },
  }
);

export const config = {
  matcher: ["/app/:path*", "/staff/:path*"],
};
