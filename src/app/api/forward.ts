const BASE_URL = process.env.BASE_URL;

// Sends the incoming request on to the Tesfa backend and hands back its answer as is.
// The caller's `Authorization: Bearer <token>` header and query string are passed along.
export async function forward(request: Request, path: string) {
  const { search } = new URL(request.url);
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const auth = request.headers.get("authorization");
  if (auth) {
    headers.Authorization = auth;
  }
  const hasBody = !["GET", "HEAD", "DELETE"].includes(request.method);

  try {
    const response = await fetch(`${BASE_URL}${path}${search}`, {
      method: request.method,
      headers,
      body: hasBody ? await request.text() : undefined,
      cache: "no-store",
    });
    const text = await response.text();
    return new Response(text || null, {
      status: response.status,
      headers: { "Content-Type": response.headers.get("Content-Type") ?? "application/json" },
    });
  } catch (error) {
    return Response.json(
      { detail: "Could not reach the Tesfa backend: " + (error as Error).message },
      { status: 502 }
    );
  }
}
