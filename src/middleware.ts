import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Verify Clerk environment keys before enabling Clerk middleware
const hasClerkSecret = Boolean(
  process.env.CLERK_SECRET_KEY &&
  process.env.CLERK_SECRET_KEY !== 'sk_test_Y2xlcmtfc2VjcmV0' &&
  !process.env.CLERK_SECRET_KEY.includes('clerk_secret')
);

const clerkHandler = hasClerkSecret ? clerkMiddleware() : null;

export default async function middleware(req: NextRequest, event: any) {
  // If Clerk is not configured on this environment (e.g. Vercel missing secret key), bypass safely
  if (!clerkHandler) {
    return NextResponse.next();
  }

  try {
    return await clerkHandler(req, event);
  } catch (error) {
    console.error("Clerk middleware execution error:", error);

    // If a handshake error occurred, strip __clerk_handshake query to prevent infinite redirect
    if (req.nextUrl.searchParams.has('__clerk_handshake')) {
      const cleanUrl = req.nextUrl.clone();
      cleanUrl.searchParams.delete('__clerk_handshake');
      return NextResponse.redirect(cleanUrl);
    }

    // Fall back to serving the request rather than crashing with 500 MIDDLEWARE_INVOCATION_FAILED
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
