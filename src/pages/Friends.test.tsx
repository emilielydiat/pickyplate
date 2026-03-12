import { render, screen } from "@testing-library/react";
import { Friends } from "./Friends";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";

vi.mock("../context/FriendsContext", () => ({
  useFriendsContext: () => ({
    friends: [],
  }),
}));

vi.mock("../hooks/usePageHeader", () => ({
  usePageHeader: vi.fn(),
}));

describe("Friends", () => {
  test("navigates to add friend page when the user clicks the add friend FAB", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/friends"]}>
        <Routes>
          <Route path="/friends" element={<Friends />} />
          <Route
            path="/friends/add-friend"
            element={<div>Add Friend Page</div>}
          />
        </Routes>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("link", { name: /add friend/i }));

    expect(screen.getByText("Add Friend Page")).toBeInTheDocument();
  });
});
