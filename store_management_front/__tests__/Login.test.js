// __tests__/Login.test.jsx

import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { jest } from "@jest/globals";
import React from "react";

// Mock FIRST
const mockedLogin = jest.fn();
jest.unstable_mockModule("../src/api", () => ({
  API_URL: "http://fake-api",
  login: mockedLogin,
}));

const mockedNavigate = jest.fn();
jest.unstable_mockModule("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
  Link: ({ children, to }) => <a href={to}>{children}</a>, // simple mock for Link
}));
const { default: Login } = await import("../src/pages/Login")

describe("Login Component", () => {

  // Clear mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock localStorage.setItem
    Storage.prototype.setItem = jest.fn();
  });

  test("renders all form fields and buttons", () => {
    render(<Login />);

    //Inputs
    expect(screen.getByRole("textbox", { name: /username/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    //Button
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();

    //Register link
    expect(screen.getByText(/register/i)).toBeInTheDocument();
  });

  // 2️⃣ Input typing test
  test("updates form fields on typing", async () => {
    render(<Login />);

    const usernameInput = screen.getByRole("textbox", { name: /username/i });
    const passwordInput = screen.getByLabelText(/password/i);

    await userEvent.type(usernameInput, "mohamed");
    await userEvent.type(passwordInput, "123456");

    expect(usernameInput).toHaveValue("mohamed");
    expect(passwordInput).toHaveValue("123456");
  });

  // 3️⃣ Successful login test
  test("calls login API and navigates on success", async () => {
    // Mock login response
    mockedLogin.mockResolvedValue({
      token: "abc123",
      user: { username: "mohamed" },
    });

    render(<Login />);

    // Fill form
    await userEvent.type(screen.getByRole("textbox", { name: /username/i }), "mohamed");
    await userEvent.type(screen.getByLabelText(/password/i), "123456");

    // Submit form
    const submitBtn = screen.getByRole("button", { name: /login/i });
    await userEvent.click(submitBtn);

    // Expect login API called with formData
    expect(mockedLogin).toHaveBeenCalledWith({ username: "mohamed", password: "123456" });

    // Expect token saved in localStorage
    expect(localStorage.setItem).toHaveBeenCalledWith("token", "abc123");

    // Expect navigation to dashboard with state
    expect(mockedNavigate).toHaveBeenCalledWith("/dashboard", {
      state: { username: "mohamed" },
    });
  });

  // 4️⃣ Failed login test
  test("shows error message on login failure", async () => {
    // Mock login to throw error
    mockedLogin.mockRejectedValue(new Error("Invalid credentials"));

    render(<Login />);

    await userEvent.type(screen.getByRole("textbox", { name: /username/i }), "wronguser");
    await userEvent.type(screen.getByLabelText(/password/i), "wrongpass");

    const submitBtn = screen.getByRole("button", { name: /login/i });
    await userEvent.click(submitBtn);

    // Wait for error message
    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();

    // Button should not be disabled anymore
    expect(submitBtn).not.toBeDisabled();
  });

  // 5️⃣ Loading state test
  test("disables submit button while loading", async () => {
    // Mock login to resolve after delay
    mockedLogin.mockImplementation(() => new Promise(res => setTimeout(() => res({ token: "abc", user: { username: "mohamed" } }), 100)));

    render(<Login />);

    await userEvent.type(screen.getByRole("textbox", { name: /username/i }), "mohamed");
    await userEvent.type(screen.getByLabelText(/password/i), "123456");

    const submitBtn = screen.getByRole("button", { name: /login/i });
    
    // Click submit and immediately check button text
    await userEvent.click(submitBtn);
    expect(submitBtn).toBeDisabled();
    expect(submitBtn).toHaveTextContent(/logging in/i);
  });

});
