const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export type ErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "UNPROCESSABLE_ENTITY"
  | "TOO_MANY_REQUESTS"
  | "INTERNAL_ERROR";

export class ApiError extends Error {
  readonly status: number;
  readonly code: ErrorCode;

  constructor(status: number, code: ErrorCode, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

export async function apiClient<T>(
  path: string,
  { body, headers, ...options }: RequestOptions = {},
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, "INTERNAL_ERROR", "서버에 연결할 수 없습니다.");
  }

  if (!res.ok) {
    let code: ErrorCode = "INTERNAL_ERROR";
    let message = `API ${res.status}: ${res.statusText}`;
    try {
      const body = await res.json();
      if (body?.code) code = body.code;
      if (body?.message) message = body.message;
    } catch { /* ignore parse error */ }
    throw new ApiError(res.status, code, message);
  }

  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}
