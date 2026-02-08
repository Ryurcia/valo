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
const mockSignInCreate = vi.fn();
const mockPrepareFirstFactor = vi.fn();
const mockAttemptFirstFactor = vi.fn();
const mockSetSignInActive = vi.fn();

const mockSignUpCreate = vi.fn();
const mockPrepareEmailAddressVerification = vi.fn();
const mockAttemptEmailAddressVerification = vi.fn();
const mockSetSignUpActive = vi.fn();

vi.mock('@clerk/nextjs', () => ({
  useSignIn: () => ({
    signIn: {
      create: mockSignInCreate,
      prepareFirstFactor: mockPrepareFirstFactor,
      attemptFirstFactor: mockAttemptFirstFactor,
    },
    isLoaded: true,
    setActive: mockSetSignInActive,
  }),
  useSignUp: () => ({
    signUp: {
      create: mockSignUpCreate,
      prepareEmailAddressVerification: mockPrepareEmailAddressVerification,
      attemptEmailAddressVerification: mockAttemptEmailAddressVerification,
    },
    isLoaded: true,
    setActive: mockSetSignUpActive,
  }),
}));

import SignInPage from '@/app/sign-in/[[...sign-in]]/page';

describe('SignInPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders sign-in form with email input', () => {
    render(<SignInPage />);
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
  });

  it('renders sign-in and sign-up tabs', () => {
    render(<SignInPage />);
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  describe('sign-in success redirects to /home', () => {
    it('redirects to /home after successful sign-in verification', async () => {
      mockSignInCreate.mockResolvedValue({
        supportedFirstFactors: [{ strategy: 'email_code', emailAddressId: 'eid_123' }],
      });
      mockPrepareFirstFactor.mockResolvedValue({});
      mockAttemptFirstFactor.mockResolvedValue({
        status: 'complete',
        createdSessionId: 'sess_123',
      });
      mockSetSignInActive.mockResolvedValue({});

      render(<SignInPage />);

      // Enter email and submit
      fireEvent.change(screen.getByPlaceholderText('Email address'), {
        target: { value: 'user@example.com' },
      });
      fireEvent.submit(screen.getByText('Continue with Email').closest('form')!);

      // Wait for verification screen
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Verification code')).toBeInTheDocument();
      });

      // Enter code and verify
      fireEvent.change(screen.getByPlaceholderText('Verification code'), {
        target: { value: '123456' },
      });
      fireEvent.submit(screen.getByText('Verify Code').closest('form')!);

      await waitFor(() => {
        expect(mockSetSignInActive).toHaveBeenCalledWith({ session: 'sess_123' });
        expect(mockPush).toHaveBeenCalledWith('/home');
      });
    });
  });

  describe('sign-up success redirects to /onboarding', () => {
    it('redirects to /onboarding after successful sign-up verification', async () => {
      mockSignUpCreate.mockResolvedValue({});
      mockPrepareEmailAddressVerification.mockResolvedValue({});
      mockAttemptEmailAddressVerification.mockResolvedValue({
        status: 'complete',
        createdSessionId: 'sess_456',
      });
      mockSetSignUpActive.mockResolvedValue({});

      render(<SignInPage />);

      // Switch to sign-up tab
      fireEvent.click(screen.getByText('Sign Up'));

      // Enter email and submit
      fireEvent.change(screen.getByPlaceholderText('Email address'), {
        target: { value: 'new@example.com' },
      });
      fireEvent.submit(screen.getByText('Continue with Email').closest('form')!);

      // Wait for verification screen
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Verification code')).toBeInTheDocument();
      });

      // Enter code and verify
      fireEvent.change(screen.getByPlaceholderText('Verification code'), {
        target: { value: '654321' },
      });
      fireEvent.submit(screen.getByText('Verify Code').closest('form')!);

      await waitFor(() => {
        expect(mockSetSignUpActive).toHaveBeenCalledWith({ session: 'sess_456' });
        expect(mockPush).toHaveBeenCalledWith('/onboarding');
      });
    });
  });

  it('switches between sign-in and sign-up tabs', () => {
    render(<SignInPage />);

    expect(screen.getByText('Welcome back')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Sign Up'));
    expect(screen.getByText('Get Started')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Sign In'));
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
  });

  it('shows error when sign-in fails for unknown account', async () => {
    mockSignInCreate.mockRejectedValue({
      errors: [{ code: 'form_identifier_not_found', longMessage: 'No account found' }],
    });

    render(<SignInPage />);

    fireEvent.change(screen.getByPlaceholderText('Email address'), {
      target: { value: 'nobody@example.com' },
    });
    fireEvent.submit(screen.getByText('Continue with Email').closest('form')!);

    await waitFor(() => {
      expect(screen.getByText(/No account found/)).toBeInTheDocument();
    });
  });
});
