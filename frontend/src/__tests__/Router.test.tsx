import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Router from "../components/Router";
import { AuthProvider } from "../context/AuthContext";

describe("Router", () => {
  test("should render register form elements", async () => {
    const { findByTestId, getByLabelText } = render(
      <AuthProvider>
        <Router />
      </AuthProvider>
    );

    expect(await findByTestId("login-button")).toBeInTheDocument();
    expect(getByLabelText("Usuário")).toBeInTheDocument();
    expect(getByLabelText("Senha")).toBeInTheDocument();
  });

  test.fails("should fail rendering private component home", async () => {
    const { findByTestId } = render(
      <AuthProvider>
        <Router />
      </AuthProvider>
    );

    expect(await findByTestId("home")).toBeInTheDocument();
  });
});
