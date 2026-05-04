import { withAuth } from "next-auth/middleware";
import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

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
