import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => <img {...props} />,
}));

// Mock LandingBackground
vi.mock('@/components/LandingBackground', () => ({
  default: () => <div data-testid='landing-background' />,
}));

// Mock Clerk
const mockUseUser = vi.fn();
vi.mock('@clerk/nextjs', () => ({
  useUser: () => mockUseUser(),
}));

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

import OnboardingPage from '@/app/onboarding/page';

describe('OnboardingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseUser.mockReturnValue({
      user: { publicMetadata: {} },
      isLoaded: true,
    });
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });
  });

  it('renders loading spinner when user is not loaded', () => {
    mockUseUser.mockReturnValue({ user: null, isLoaded: false });
    render(<OnboardingPage />);
    expect(screen.getByTestId('landing-background')).toBeInTheDocument();
    expect(screen.queryByText('Complete Your Profile')).not.toBeInTheDocument();
  });

  it('redirects to /home if onboarding is already complete', async () => {
    mockUseUser.mockReturnValue({
      user: { publicMetadata: { onboardingComplete: true } },
      isLoaded: true,
    });
    render(<OnboardingPage />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/home');
    });
  });

  it('renders all form fields', () => {
    render(<OnboardingPage />);

    expect(screen.getByText('Complete Your Profile')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('John')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Doe')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('johndoe')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Acme Inc.')).toBeInTheDocument();
    expect(screen.getByText('First Name *')).toBeInTheDocument();
    expect(screen.getByText('Last Name *')).toBeInTheDocument();
    expect(screen.getByText('Username *')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
    expect(screen.getByText('Country')).toBeInTheDocument();
    expect(screen.getByText('Company Name')).toBeInTheDocument();
  });

  it('renders role dropdown options', () => {
    render(<OnboardingPage />);
    const roleSelect = screen.getByText('Select a role').closest('select')!;
    expect(roleSelect).toBeInTheDocument();

    const options = Array.from(roleSelect.querySelectorAll('option')).map((o) => o.textContent);
    expect(options).toContain('Entrepreneur');
    expect(options).toContain('Developer');
    expect(options).toContain('Investor');
    expect(options).toContain('Other');
  });

  it('renders country dropdown with comprehensive list', () => {
    render(<OnboardingPage />);
    const countrySelect = screen.getByText('Select a country').closest('select')!;
    const options = Array.from(countrySelect.querySelectorAll('option')).map((o) => o.textContent);
    expect(options).toContain('United States');
    expect(options).toContain('United Kingdom');
    expect(options).toContain('Japan');
    expect(options).toContain('Brazil');
  });

  it('submits form and redirects to /home on success', async () => {
    render(<OnboardingPage />);

    fireEvent.change(screen.getByPlaceholderText('John'), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByPlaceholderText('Doe'), { target: { value: 'Smith' } });
    fireEvent.change(screen.getByPlaceholderText('johndoe'), { target: { value: 'janesmith' } });

    fireEvent.submit(screen.getByText('Continue').closest('form')!);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: 'Jane',
          lastName: 'Smith',
          username: 'janesmith',
          companyName: '',
          role: '',
          country: '',
        }),
      });
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/home');
    });
  });

  it('shows error message when username is taken', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'Username is already taken. Please choose another.' }),
    });

    render(<OnboardingPage />);

    fireEvent.change(screen.getByPlaceholderText('John'), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByPlaceholderText('Doe'), { target: { value: 'Smith' } });
    fireEvent.change(screen.getByPlaceholderText('johndoe'), { target: { value: 'taken' } });

    fireEvent.submit(screen.getByText('Continue').closest('form')!);

    await waitFor(() => {
      expect(screen.getByText('Username is already taken. Please choose another.')).toBeInTheDocument();
    });

    // Should NOT redirect
    expect(mockPush).not.toHaveBeenCalledWith('/home');
  });

  it('shows generic error on network failure', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    render(<OnboardingPage />);

    fireEvent.change(screen.getByPlaceholderText('John'), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByPlaceholderText('Doe'), { target: { value: 'Smith' } });
    fireEvent.change(screen.getByPlaceholderText('johndoe'), { target: { value: 'janesmith' } });

    fireEvent.submit(screen.getByText('Continue').closest('form')!);

    await waitFor(() => {
      expect(screen.getByText('Something went wrong. Please try again.')).toBeInTheDocument();
    });
  });

  it('shows loading state while submitting', async () => {
    let resolveFetch: (value: unknown) => void;
    mockFetch.mockReturnValue(
      new Promise((resolve) => {
        resolveFetch = resolve;
      })
    );

    render(<OnboardingPage />);

    fireEvent.change(screen.getByPlaceholderText('John'), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByPlaceholderText('Doe'), { target: { value: 'Smith' } });
    fireEvent.change(screen.getByPlaceholderText('johndoe'), { target: { value: 'janesmith' } });

    fireEvent.submit(screen.getByText('Continue').closest('form')!);

    await waitFor(() => {
      expect(screen.getByText('Setting up your account...')).toBeInTheDocument();
    });

    resolveFetch!({ ok: true, json: () => Promise.resolve({ success: true }) });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/home');
    });
  });
});
