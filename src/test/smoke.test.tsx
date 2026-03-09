import { render, screen } from "./test-utils";

function Demo() {
  return <button>Save</button>;
}

test("renders a save button", () => {
  render(<Demo />);
  expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
});
