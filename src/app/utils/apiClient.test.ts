import { apiFetch, BUSY_MESSAGE, readError } from "./apiClient";

global.fetch = jest.fn();
const fetchMock = fetch as jest.Mock;

const reply = (status: number, body: unknown) => ({
  ok: status >= 200 && status < 300,
  status,
  statusText: "",
  json: async () => body,
  text: async () => JSON.stringify(body),
});

describe("apiFetch", () => {
  afterEach(() => {
    jest.resetAllMocks();
    localStorage.clear();
  });

  it("sends the stored token as a Bearer header", async () => {
    localStorage.setItem("token", "abc");
    fetchMock.mockResolvedValue(reply(200, [{ id: 1 }]));

    const data = await apiFetch("/api/users");

    const headers = fetchMock.mock.calls[0][1].headers as Headers;
    expect(headers.get("Authorization")).toBe("Bearer abc");
    expect(data).toEqual([{ id: 1 }]);
  });

  it("says the site is busy on a 503", async () => {
    fetchMock.mockResolvedValue(reply(503, { detail: "Tesfa AI is busy, plese try again" }));

    await expect(apiFetch("/api/query")).rejects.toMatchObject({ message: BUSY_MESSAGE, status: 503 });
  });

  it("leaves the token off when auth is false", async () => {
    localStorage.setItem("token", "stale");
    fetchMock.mockResolvedValue(reply(200, {}));

    await apiFetch("/api/auth", { method: "POST", auth: false, body: "{}" });

    const headers = fetchMock.mock.calls[0][1].headers as Headers;
    expect(headers.get("Authorization")).toBeNull();
  });

  it("refreshes an expired token once and retries", async () => {
    localStorage.setItem("token", "old");
    localStorage.setItem("refresh", "r1");
    fetchMock
      .mockResolvedValueOnce(reply(401, { detail: "expired" }))
      .mockResolvedValueOnce(reply(200, { access: "new" }))
      .mockResolvedValueOnce(reply(200, { ok: true }));

    const data = await apiFetch("/api/profile");

    expect(fetchMock.mock.calls[1][0]).toBe("/api/token/refresh");
    expect((fetchMock.mock.calls[2][1].headers as Headers).get("Authorization")).toBe("Bearer new");
    expect(data).toEqual({ ok: true });
  });

  it("clears the session when the refresh fails", async () => {
    localStorage.setItem("token", "old");
    localStorage.setItem("refresh", "r1");
    localStorage.setItem("user", "{}");
    fetchMock.mockResolvedValueOnce(reply(401, {})).mockResolvedValueOnce(reply(401, {}));

    await expect(apiFetch("/api/profile")).rejects.toThrow("Your session has expired");
    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
  });

  it("throws the backend's message", async () => {
    fetchMock.mockResolvedValue(reply(400, { non_field_errors: ["Invalid credentials."] }));
    await expect(apiFetch("/api/auth", { auth: false })).rejects.toThrow("Invalid credentials.");
  });
});

describe("readError", () => {
  it("joins DRF field errors into one sentence", async () => {
    const message = await readError(
      reply(400, { email: ["Email already registered."], phone_number: ["Phone number already registered."] }) as unknown as Response
    );
    expect(message).toBe("Email: Email already registered. Phone number: Phone number already registered.");
  });
});
