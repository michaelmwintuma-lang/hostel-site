import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Inline the check here to avoid importing server-only modules into the Edge runtime
const isClerkConfigured =
  process.env.CLERK_SECRET_KEY &&
  process.env.CLERK_SECRET_KEY !== 'sk_test_Y2xlcmtfc2VjcmV0';

export default isClerkConfigured
  ? clerkMiddleware()
  : (req: any) => {
      // Offline mode: bypass authentication checks
      return;
    };

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html|css|js(?!on)|jpeg|jpg|png|gif|svg|ttf|woff2?|ico|csv|docx|xlsx|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
