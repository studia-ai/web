import { NextResponse } from 'next/server';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',                     // Landing page
  '/sign-in(.*)',          // Sign in pages
  '/sign-up(.*)',          // Sign up pages
  '/unauthorized(.*)',      // Unauthorized page
  '/api/webhook(.*)',      // Webhooks
])

// Define protected routes (dashboard and its sub-routes)
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const { pathname, origin } = req.nextUrl;

  // If the user is not authenticated and trying to access a protected route
  if (!userId && isProtectedRoute(req)) {
    console.log('User not authenticated, redirecting to unauthorized');
    return NextResponse.redirect(`${origin}/unauthorized`);
  }

  // If the user is authenticated and on a public route, redirect them to dashboard
  if (userId && isPublicRoute(req) && pathname !== '/') {
    console.log('Redirecting authenticated user to dashboard');
    return NextResponse.redirect(`${origin}/dashboard`);
  }

  return NextResponse.next();
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}