import "@testing-library/jest-dom";
import { screen, fireEvent, render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { AuthProvider } from "../context/AuthContext";
import { BrowserRouter } from "react-router-dom";
import Login from "../screens/Login";

describe("Login", () => {
  test("should render login form elements", () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </AuthProvider>
    );

    // checks if the login form is rendered
    expect(screen.getByTestId("login-button")).toBeInTheDocument();
    expect(screen.getByLabelText("Usuário")).toBeInTheDocument();
    expect(screen.getByLabelText("Senha")).toBeInTheDocument();
  });

  test("should render login redirection link", () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </AuthProvider>
    );

    expect(screen.getByText("Cadastre-se")).toBeInTheDocument();
  });

  test("handles login action", () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </AuthProvider>
    );

    fireEvent.change(screen.getByLabelText("Usuário"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText("Senha"), {
      target: { value: "testpassword" },
    });

    fireEvent.click(screen.getByTestId("login-button"));
  });
});
