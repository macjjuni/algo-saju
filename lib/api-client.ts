const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

export async function apiClient<T>(
  path: string,
  { body, headers, ...options }: RequestOptions = {},
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let message = `API ${res.status}: ${res.statusText}`;
    try {
      const body = await res.json();
      if (body?.message) message = body.message;
    } catch { /* ignore parse error */ }
    const error = new Error(message);
    (error as Error & { status: number }).status = res.status;
    throw error;
  }

  return res.json();
}

export function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}
