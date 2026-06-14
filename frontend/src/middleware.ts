import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Protect the admin routes
const isAdminRoute = createRouteMatcher(['/admin(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req)) {
    const authObj = await auth()
    
    // Check if the user is authenticated with Clerk
    if (!authObj.userId) {
      const url = new URL('/', req.url)
      return NextResponse.redirect(url)
    }

    // Try to get their session claims
    const sessionClaims = authObj.sessionClaims as { email?: string } | null;
    const userEmail = sessionClaims?.email;
    
    // Check if they are in the ADMIN_EMAILS list
    const adminEmailsRaw = process.env.ADMIN_EMAILS || "";
    const adminEmails = adminEmailsRaw.split(',').map(e => e.trim().toLowerCase());
    
    if (!userEmail || !adminEmails.includes(userEmail.toLowerCase())) {
      // If not an admin, boot them out of the admin panel
      const url = new URL('/', req.url)
      return NextResponse.redirect(url)
    }
  }
  
  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
