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
  const response = intlMiddleware(req);
  
  // Intercept the response and clean the Location header if it contains internal ports
  const location = response.headers.get('location');
  if (location && (location.includes(':8080') || location.includes(':3000'))) {
    const cleanLocation = location
      .replace(':8080', '')
      .replace(':3000', '')
      // In production, we want to ensure redirects stay on https
      .replace('http://', 'https://');
    
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
  matcher: ['/', '/(nl|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};
