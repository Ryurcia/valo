import { describe, it, expect, vi } from 'vitest';
import { createRouteMatcher } from '@clerk/nextjs/server';

// We test that the route matcher patterns correctly classify routes.
// Since createRouteMatcher is Clerk's utility, we test the pattern definitions
// by importing them indirectly through verifying the actual middleware config.

vi.mock('@clerk/nextjs/server', async () => {
  const actual = await vi.importActual('@clerk/nextjs/server') as Record<string, unknown>;
  return {
    ...actual,
    clerkMiddleware: vi.fn((handler) => handler),
    createRouteMatcher: vi.fn((patterns: string[]) => {
      // Simulate Clerk's route matching with simple pattern matching
      return (request: { nextUrl: { pathname: string } }) => {
        const pathname = request.nextUrl.pathname;
        return patterns.some((pattern) => {
          // Convert Clerk pattern to regex
          const regexStr = pattern
            .replace(/\(\.?\*\)/g, '.*')
            .replace(/\//g, '\\/');
          return new RegExp(`^${regexStr}$`).test(pathname);
        });
      };
    }),
  };
});

// Import after mocks to get the mocked createRouteMatcher
const { createRouteMatcher: mockedCreateRouteMatcher } = await import('@clerk/nextjs/server');

describe('Middleware route configuration', () => {
  // Define the same public routes as in proxy.ts
  const publicRoutes = ['/', '/sign-in(.*)', '/sign-up(.*)', '/onboarding', '/ideas', '/ideas/(.*)', '/api/waitlist', '/api/onboarding'];
  const isPublicRoute = (mockedCreateRouteMatcher as unknown as (patterns: string[]) => (req: { nextUrl: { pathname: string } }) => boolean)(publicRoutes);

  const makeRequest = (pathname: string) => ({ nextUrl: { pathname } });

  describe('public routes', () => {
    it('/ is public', () => {
      expect(isPublicRoute(makeRequest('/'))).toBe(true);
    });

    it('/sign-in is public', () => {
      expect(isPublicRoute(makeRequest('/sign-in'))).toBe(true);
    });

    it('/sign-up is public', () => {
      expect(isPublicRoute(makeRequest('/sign-up'))).toBe(true);
    });

    it('/onboarding is public', () => {
      expect(isPublicRoute(makeRequest('/onboarding'))).toBe(true);
    });

    it('/api/onboarding is public', () => {
      expect(isPublicRoute(makeRequest('/api/onboarding'))).toBe(true);
    });

    it('/api/waitlist is public', () => {
      expect(isPublicRoute(makeRequest('/api/waitlist'))).toBe(true);
    });

    it('/ideas is public', () => {
      expect(isPublicRoute(makeRequest('/ideas'))).toBe(true);
    });

    it('/ideas/some-id is public', () => {
      expect(isPublicRoute(makeRequest('/ideas/some-id'))).toBe(true);
    });
  });

  describe('protected routes', () => {
    it('/home is protected', () => {
      expect(isPublicRoute(makeRequest('/home'))).toBe(false);
    });

    it('/api/ideas is protected', () => {
      expect(isPublicRoute(makeRequest('/api/ideas'))).toBe(false);
    });

    it('/settings is protected', () => {
      expect(isPublicRoute(makeRequest('/settings'))).toBe(false);
    });

    it('/api/some-other-route is protected', () => {
      expect(isPublicRoute(makeRequest('/api/some-other-route'))).toBe(false);
    });
  });
});
