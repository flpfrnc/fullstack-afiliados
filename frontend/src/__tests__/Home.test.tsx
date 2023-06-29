import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Home from "../screens/Home";

describe("Home", () => {
  test("should not render table component with no values", async () => {
    const { queryByTestId } = render(<Home />);
    expect(queryByTestId("transaction-table")).not.toBeInTheDocument();
    expect(queryByTestId("transaction-row")).not.toBeInTheDocument();
  });

  test("should render no transaction component", async () => {
    const { queryByTestId } = render(<Home />);
    expect(queryByTestId("no-transaction")).toBeInTheDocument();
  });

  test("should render data successfully", async () => {
    const { findByText } = render(<Home />);

    const value = await findByText("CURSO DE BEM-ESTAR");
    expect(value.innerHTML).toBe("CURSO DE BEM-ESTAR");
  });

  test("should render total transactions data", async () => {
    const { queryByTestId } = render(<Home />);

    expect(queryByTestId("total-transactions")).toBeInTheDocument();
  });

  test("input should render with no values", async () => {
    const { findByTestId } = render(<Home />);

    const input = await findByTestId("file-input");
    expect(input).not.toHaveValue();
  });
});
