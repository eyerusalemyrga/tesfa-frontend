import { fetchLogin } from "./fetchLogin";

global.fetch = jest.fn();

describe("fetchLogin", () => {
  afterEach(() => jest.resetAllMocks());

  it("posts the credentials and returns the tokens and user", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ access: "a", refresh: "r", user: { id: 1, user_type: "Admin" } }),
    });

    const result = await fetchLogin("test@email.com", "1234");

    expect(fetch).toHaveBeenCalledWith("/api/auth", expect.objectContaining({
      method: "POST",
      body: JSON.stringify({ email: "test@email.com", password: "1234" }),
    }));
    expect(result.access).toBe("a");
    expect(result.user.user_type).toBe("Admin");
  });
});
