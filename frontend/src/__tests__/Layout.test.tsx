import "@testing-library/jest-dom";
import { fireEvent, render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Layout from "../components/Layout";
import { AuthProvider } from "../context/AuthContext";

describe("Layout", () => {
  test("Layout mounts properly", () => {
    const { getByText, getByTestId } = render(
      <Layout>
        <div>Test Element</div>
      </Layout>
    );

    expect(getByText("FullStack Afiliados")).toBeInTheDocument();
    expect(getByTestId("logout")).toBeInTheDocument();
  });

  test("should logout successfully", async () => {
    const { getByText, getByTestId } = render(
      <AuthProvider>
        <Layout>
          <div>Test Element</div>
        </Layout>
      </AuthProvider>
    );

    expect(getByText("FullStack Afiliados")).toBeInTheDocument();
    expect(getByTestId("logout")).toBeInTheDocument();
    fireEvent.click(getByTestId("logout"));
  });
});
