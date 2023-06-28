import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Home from "../screens/Home";

describe("Home", () => {
  test("should render table component with no values", async () => {
    const { queryByTestId } = render(<Home />);
    expect(queryByTestId("transaction-table")).toBeInTheDocument();
    expect(queryByTestId("transaction-row")).not.toBeInTheDocument();
  });

  test("should render table successfully", async () => {
    const { queryByTestId, findByText } = render(<Home />);

    expect(queryByTestId("transaction-table")).toBeInTheDocument();
    expect(queryByTestId("load-transaction-data")).toBeInTheDocument();

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
