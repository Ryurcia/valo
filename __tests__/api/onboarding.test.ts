import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// Mock Clerk
const mockUpdateUser = vi.fn();
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
  clerkClient: vi.fn(() =>
    Promise.resolve({
      users: { updateUser: mockUpdateUser },
    })
  ),
}));

// Mock Supabase
const mockInsert = vi.fn();
vi.mock('@/lib/supabase-server', () => ({
  createServerSupabaseClient: () => ({
    from: () => ({ insert: mockInsert }),
  }),
  supabaseAdmin: {
    from: () => ({ insert: mockInsert }),
  },
}));

import { POST } from '@/app/api/onboarding/route';
import { auth } from '@clerk/nextjs/server';

const mockAuth = vi.mocked(auth);

function makeRequest(body: Record<string, unknown>) {
  return new NextRequest('http://localhost:3000/api/onboarding', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

const validBody = {
  firstName: 'John',
  lastName: 'Doe',
  username: 'johndoe',
  companyName: 'Acme',
  role: 'Developer',
  country: 'United States',
};

describe('POST /api/onboarding', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth.mockResolvedValue({ userId: 'user_123' } as ReturnType<typeof auth> extends Promise<infer T> ? T : never);
    mockUpdateUser.mockResolvedValue({});
    mockInsert.mockResolvedValue({ error: null });
  });

  it('returns 401 when user is not authenticated', async () => {
    mockAuth.mockResolvedValue({ userId: null } as ReturnType<typeof auth> extends Promise<infer T> ? T : never);

    const res = await POST(makeRequest(validBody));
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('returns 400 when required fields are missing', async () => {
    const res = await POST(makeRequest({ firstName: 'John' }));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toContain('required');
  });

  it('returns 400 when firstName is empty', async () => {
    const res = await POST(makeRequest({ firstName: '', lastName: 'Doe', username: 'johndoe' }));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toContain('required');
  });

  it('updates Clerk user with correct fields and publicMetadata', async () => {
    await POST(makeRequest(validBody));

    expect(mockUpdateUser).toHaveBeenCalledWith('user_123', {
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      publicMetadata: { onboardingComplete: true },
    });
  });

  it('inserts row into Supabase users table', async () => {
    await POST(makeRequest(validBody));

    expect(mockInsert).toHaveBeenCalledWith({
      clerk_id: 'user_123',
      first_name: 'John',
      last_name: 'Doe',
      username: 'johndoe',
      company_name: 'Acme',
      role: 'Developer',
      country: 'United States',
    });
  });

  it('sets optional fields to null when not provided', async () => {
    await POST(makeRequest({ firstName: 'John', lastName: 'Doe', username: 'johndoe' }));

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        company_name: null,
        role: null,
        country: null,
      })
    );
  });

  it('returns success on valid onboarding', async () => {
    const res = await POST(makeRequest(validBody));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('returns 409 when username is already taken', async () => {
    mockUpdateUser.mockRejectedValue({
      errors: [{ code: 'form_identifier_exists', message: 'That username is taken' }],
    });

    const res = await POST(makeRequest(validBody));
    const data = await res.json();

    expect(res.status).toBe(409);
    expect(data.error).toContain('already taken');
  });

  it('returns 500 for other Clerk errors', async () => {
    mockUpdateUser.mockRejectedValue({
      errors: [{ code: 'some_other_error', message: 'Something broke' }],
    });

    const res = await POST(makeRequest(validBody));
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBe('Something broke');
  });

  it('still returns success even if Supabase insert fails', async () => {
    mockInsert.mockResolvedValue({ error: { message: 'DB error' } });

    const res = await POST(makeRequest(validBody));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
  });
});
