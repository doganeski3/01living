import { createMollieClient } from '@mollie/api-client';

const MOLLIE_API_KEY = process.env.MOLLIE_API_KEY || '';

// Initialize Mollie client only if a real key is provided.
// If the key is missing or is a placeholder, we keep it undefined to use mock logic.
export const mollieClient = MOLLIE_API_KEY && MOLLIE_API_KEY !== 'mock_key_for_now' 
  ? createMollieClient({ apiKey: MOLLIE_API_KEY }) 
  : null;
