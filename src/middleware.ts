import { withAuth } from "next-auth/middleware";
import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

const locales = ['nl', 'en'];
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: 'nl'
});

const authMiddleware = withAuth(
  function onSuccess(req) {
    return handleIntlAndStripPort(req);
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // If it's an admin page, check for ADMIN role
        if (req.nextUrl.pathname.includes('/01admin-portal')) {
          return token?.role === "ADMIN";
        }
        return true;
      },
    },
    pages: {
      signIn: '/nl/login',
    },
  }
);

// Helper to handle intl redirects and strip internal ports
function handleIntlAndStripPort(req: NextRequest) {
  const host = req.headers.get('host');
  // Detect protocol more robustly for proxy environments
  const xForwardedProto = req.headers.get('x-forwarded-proto') || req.headers.get('X-Forwarded-Proto');
  const protocol = xForwardedProto || (req.nextUrl.protocol === 'https:' ? 'https' : 'http');
  const isLocalhost = host?.includes('localhost') || host?.includes('127.0.0.1');

  // 1. Force HTTPS in production if not already on HTTPS
  if (!isLocalhost && protocol !== 'https') {
    const httpsUrl = req.nextUrl.clone();
    httpsUrl.protocol = 'https:';
    if (host) httpsUrl.host = host;
    return NextResponse.redirect(httpsUrl, 301);
  }

  const response = intlMiddleware(req);
  
  // Intercept the response and clean the Location header
  const location = response.headers.get('location');
  if (location) {
    let cleanLocation = location;
    
    // 2. Remove internal ports (8080/3000)
    cleanLocation = cleanLocation.replace(':8080', '').replace(':3000', '');
    
    // 3. If the redirect is to localhost but the request was for a real domain, fix the domain
    if (host && !isLocalhost && cleanLocation.includes('localhost')) {
      cleanLocation = cleanLocation.replace(/localhost(:\d+)?/, host);
    }
    
    // 4. Ensure HTTPS in production for redirects
    if (!isLocalhost && cleanLocation.startsWith('http://')) {
      cleanLocation = cleanLocation.replace('http://', 'https://');
    }
    
    response.headers.set('location', cleanLocation);
  }
  
  return response;
}

export default function middleware(req: NextRequest) {
  const isPublicPage = !req.nextUrl.pathname.includes('/01admin-portal');

  if (isPublicPage) {
    return handleIntlAndStripPort(req);
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (authMiddleware as any)(req);
  }
}

export const config = {
  // Match all pathnames except for
  // - /api (API routes)
  // - /_next (Next.js internals)
  // - /_vercel (Vercel internals)
  // - all root files inside public (e.g. /favicon.ico)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
