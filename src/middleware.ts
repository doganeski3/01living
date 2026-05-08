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
    return intlMiddleware(req);
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

export default function middleware(req: NextRequest) {
  // Fix for Railway: Strip internal port numbers from the host to prevent leaking into redirects
  const host = req.headers.get('host');
  if (host && (host.includes(':8080') || host.includes(':3000'))) {
    const url = req.nextUrl.clone();
    url.port = ''; // Clear the port
    // Ensure we maintain the protocol, especially in production
    if (process.env.NODE_ENV === 'production') {
      url.protocol = 'https:';
    }
    return NextResponse.redirect(url);
  }

  const isPublicPage = !req.nextUrl.pathname.includes('/01admin-portal');

  if (isPublicPage) {
    return intlMiddleware(req);
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (authMiddleware as any)(req);
  }
}

export const config = {
  matcher: ['/', '/(nl|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};
