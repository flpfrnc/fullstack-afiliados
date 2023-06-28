import "@testing-library/jest-dom";
import { screen, fireEvent, render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { AuthProvider } from "../context/AuthContext";
import { BrowserRouter } from "react-router-dom";
import Register from "../screens/Register";

describe("Register", () => {
  test("should render register form elements", () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </AuthProvider>
    );

    // checks if the register form is rendered
    expect(screen.getByTestId("register-button")).toBeInTheDocument();
    expect(screen.getByLabelText("Usuário")).toBeInTheDocument();
    expect(screen.getByLabelText("Senha")).toBeInTheDocument();
  });

  test("should render login redirection link", () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </AuthProvider>
    );

    expect(screen.getByText("Fazer Login")).toBeInTheDocument();
  });

  test("should handle register action", () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </AuthProvider>
    );

    fireEvent.change(screen.getByLabelText("Usuário"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText("Senha"), {
      target: { value: "testpassword" },
    });

    fireEvent.click(screen.getByTestId("register-button"));
  });
});
