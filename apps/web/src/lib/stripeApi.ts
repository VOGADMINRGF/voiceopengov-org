type StripeError = { error?: { message?: string } };

async function stripeRequest<T>(path: string, secret: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`https://api.stripe.com/v1${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${secret}`, ...init?.headers },
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  const body = await response.json().catch(() => null) as (T & StripeError) | null;
  if (!response.ok || !body) throw new Error(`stripe_request_failed:${response.status}`);
  return body;
}

export function retrieveStripeCheckoutSession(sessionId: string, secret: string) {
  return stripeRequest<Record<string, unknown>>(`/checkout/sessions/${encodeURIComponent(sessionId)}`, secret);
}

export async function createStripePortalSession(customerId: string, returnUrl: string, secret: string) {
  const body = new URLSearchParams({ customer: customerId, return_url: returnUrl });
  return stripeRequest<{ id?: string; url?: string }>("/billing_portal/sessions", secret, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
}
