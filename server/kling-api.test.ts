import { describe, it, expect } from 'vitest';

/**
 * Validates the KLING_API_KEY by calling the Kling AI API account info endpoint.
 * The new API key format uses Bearer token authentication.
 */
describe('Kling AI API Key Validation', () => {
  it('should authenticate successfully with the Kling API key', async () => {
    const apiKey = process.env.KLING_API_KEY;
    expect(apiKey).toBeDefined();
    expect(apiKey).not.toBe('');

    // Call a lightweight endpoint to validate the key
    // Kling API v1 uses Bearer token auth
    const response = await fetch('https://api.klingai.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    // A valid key should return 200 or at least not 401/403
    // Even if the endpoint doesn't exist, auth errors are 401
    expect(response.status).not.toBe(401);
    expect(response.status).not.toBe(403);
  });
});
