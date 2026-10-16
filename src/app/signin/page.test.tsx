import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignInPage from "./page";

const push = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

const login = jest.fn();
jest.mock("../hooks/useFetchLogin", () => ({
  useFetchLogin: () => ({ login, isLoading: false, error: null }),
}));

function fillAndSubmit(password: string) {
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "a@b.com" } });
  fireEvent.change(screen.getByLabelText("Password"), { target: { value: password } });
  fireEvent.click(screen.getByRole("button", { name: "Log in" }));
}

describe("SignInPage", () => {
  afterEach(() => jest.clearAllMocks());

  it("sends health professionals to the chat", async () => {
    login.mockResolvedValue({ access: "a", refresh: "r", user: { user_type: "Health Professional" } });
    render(<SignInPage />);
    fillAndSubmit("secret");

    await waitFor(() => expect(push).toHaveBeenCalledWith("/"));
    expect(login).toHaveBeenCalledWith("a@b.com", "secret");
  });

  it("sends admins to the admin dashboard", async () => {
    login.mockResolvedValue({ access: "a", refresh: "r", user: { user_type: "Admin" } });
    render(<SignInPage />);
    fillAndSubmit("secret");

    await waitFor(() => expect(push).toHaveBeenCalledWith("/admin"));
  });

  it("stays on the page when login fails", async () => {
    login.mockResolvedValue(null);
    render(<SignInPage />);
    fillAndSubmit("bad");

    await waitFor(() => expect(login).toHaveBeenCalled());
    expect(push).not.toHaveBeenCalled();
  });
});
