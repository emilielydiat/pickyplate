import { render, screen } from "../test/test-utils";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  test("renders the required text content", () => {
    render(
      <EmptyState textContent="Select a friend and invite them to eat together!" />,
    );

    expect(
      screen.getByText("Select a friend and invite them to eat together!"),
    ).toBeInTheDocument();
  });

  test("renders the heading when provided", () => {
    render(
      <EmptyState
        textContent="Select a friend and invite them to eat together!"
        heading="No requests yet"
      />,
    );

    expect(screen.getByText("No requests yet")).toBeInTheDocument();
    expect(
      screen.getByText("Select a friend and invite them to eat together!"),
    ).toBeInTheDocument();
  });

  test("does not render a heading when not provided", () => {
    render(
      <EmptyState textContent="Select a friend and invite them to eat together!" />,
    );

    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  test("renders an image with the correct alt text when provided", () => {
    render(
      <EmptyState
        textContent="Select a friend and invite them to eat together!"
        image="test-image.png"
        altText="No meal requests illustration"
      />,
    );

    expect(
      screen.getByAltText("No meal requests illustration"),
    ).toBeInTheDocument();
  });

  test("does not render an image when not provided", () => {
    render(
      <EmptyState textContent="Select a friend and invite them to eat together!" />,
    );

    expect(screen.queryByTestId("empty-state-img")).not.toBeInTheDocument();
  });

  test("renders a button when provided", () => {
    render(
      <EmptyState
        textContent="Select a friend and invite them to eat together!"
        button={<button>Submit</button>}
      />,
    );

    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  test("does not render a button when not provided", () => {
    render(
      <EmptyState textContent="Select a friend and invite them to eat together!" />,
    );

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
