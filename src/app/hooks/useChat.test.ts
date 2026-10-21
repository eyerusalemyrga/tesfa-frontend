import { act, renderHook } from "@testing-library/react";
import { ApiError } from "../utils/apiClient";
import { useChat } from "./useChat";

const fetchQuery = jest.fn();
jest.mock("../utils/fetchQuery", () => ({ fetchQuery: (...args: unknown[]) => fetchQuery(...args) }));

const filters = { region: "", conflict_type: "" };

describe("useChat", () => {
  afterEach(() => {
    jest.resetAllMocks();
    localStorage.clear();
  });

  it("adds the question and answer and keeps the conversation going", async () => {
    fetchQuery.mockResolvedValue({ id: 2, conversation: 7, role: "assistant", content: "Answer" });
    const onSaved = jest.fn();
    const { result } = renderHook(() => useChat(onSaved));

    await act(() => result.current.send("Question?", filters));
    expect(result.current.messages.map((m) => m.content)).toEqual(["Question?", "Answer"]);
    expect(result.current.conversationId).toBe(7);
    expect(onSaved).toHaveBeenCalled();

    await act(() => result.current.send("Follow up", filters));
    expect(fetchQuery).toHaveBeenLastCalledWith(expect.objectContaining({ query: "Follow up", conversation_id: 7 }));
  });

  it("asks guests to have an account when the backend refuses them", async () => {
    fetchQuery.mockRejectedValue(new ApiError("Authentication credentials were not provided.", 401));
    const { result } = renderHook(() => useChat());

    await act(() => result.current.send("Hi", filters));
    expect(result.current.needsAccount).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("shows the backend's error", async () => {
    fetchQuery.mockRejectedValue(new ApiError("The AI service is busy right now.", 503));
    const { result } = renderHook(() => useChat());

    await act(() => result.current.send("Hi", filters));
    expect(result.current.error).toBe("The AI service is busy right now.");
  });
});
