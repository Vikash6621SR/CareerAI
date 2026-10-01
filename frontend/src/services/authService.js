import api from "./api";

/*
 * REGISTER
 */
export async function registerUser(userData) {
  const response = await api.post("/auth/register", {
    name: userData.name.trim(),
    email: userData.email.trim(),
    password: userData.password,
  });

  return response.data;
}

/*
 * LOGIN
 */
export async function loginUser(credentials) {
  if (!credentials) {
    throw new Error("Login credentials are missing.");
  }

  const email = credentials.email?.trim();
  const password = credentials.password;

  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  const response = await api.post("/auth/login", {
    email,
    password,
  });

  const data = response.data;

  if (!data?.token) {
    throw new Error("Login succeeded but no JWT token was returned.");
  }

  localStorage.setItem("careerAI_token", data.token);

  if (data.user) {
    localStorage.setItem("careerAI_user", JSON.stringify(data.user));
  }

  return data;
}

/*
 * LOGOUT
 */
export function logoutUser() {
  return true;
}

/*
 * TOKEN
 */
export function getToken() {
  return localStorage.getItem("careerAI_token");
}

/*
 * AUTHENTICATION
 */
export function isAuthenticated() {
  return Boolean(getToken());
}

/*
 * STORED USER
 */
export function getStoredUser() {
  try {
    const storedUser = localStorage.getItem("careerAI_user");

    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem("careerAI_user");

    return null;
  }
}
