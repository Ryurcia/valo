import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

// Mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

// Mock Clerk
const mockUseUser = vi.fn();
vi.mock('@clerk/nextjs', () => ({
  useUser: () => mockUseUser(),
}));

import AuthLayout from '@/app/(Auth)/layout';

describe('AuthLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading spinner while user is loading', () => {
    mockUseUser.mockReturnValue({ user: null, isLoaded: false });
    render(<AuthLayout><div>Protected Content</div></AuthLayout>);

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    // Spinner is present (animated div)
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('redirects to /onboarding when onboarding is not complete', async () => {
    mockUseUser.mockReturnValue({
      user: { publicMetadata: {} },
      isLoaded: true,
    });

    render(<AuthLayout><div>Protected Content</div></AuthLayout>);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/onboarding');
    });

    // Should not render children
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('redirects when onboardingComplete is explicitly false', async () => {
    mockUseUser.mockReturnValue({
      user: { publicMetadata: { onboardingComplete: false } },
      isLoaded: true,
    });

    render(<AuthLayout><div>Protected Content</div></AuthLayout>);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/onboarding');
    });
  });

  it('renders children when onboarding is complete', () => {
    mockUseUser.mockReturnValue({
      user: { publicMetadata: { onboardingComplete: true } },
      isLoaded: true,
    });

    render(<AuthLayout><div>Protected Content</div></AuthLayout>);

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('does not redirect when user has completed onboarding (returning user)', () => {
    mockUseUser.mockReturnValue({
      user: { publicMetadata: { onboardingComplete: true } },
      isLoaded: true,
    });

    render(<AuthLayout><div>Dashboard</div></AuthLayout>);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalledWith('/onboarding');
  });
});
