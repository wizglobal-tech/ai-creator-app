export type StoredUser = {
  name: string;
  email: string;
  password: string;
};

export type SessionUser = {
  name: string;
  email: string;
};

const USERS_KEY = "ai_studio_users";
const SESSION_KEY = "ai_studio_session";

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function getUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  return safeParse<StoredUser[]>(window.localStorage.getItem(USERS_KEY), []);
}

function setUsers(users: StoredUser[]) {
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getSession(): SessionUser | null {
  if (typeof window === "undefined") return null;
  return safeParse<SessionUser | null>(
    window.localStorage.getItem(SESSION_KEY),
    null
  );
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
}

function setSession(user: SessionUser) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function signup(input: { name: string; email: string; password: string }) {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const password = input.password;

  if (name.length < 2) throw new Error("Name must be at least 2 characters.");
  if (!isValidEmail(email)) throw new Error("Please enter a valid email.");
  if (password.length < 6)
    throw new Error("Password must be at least 6 characters.");

  const users = getUsers();
  if (users.some((u) => u.email === email)) {
    throw new Error("An account with this email already exists.");
  }

  const nextUser: StoredUser = { name, email, password };
  setUsers([...users, nextUser]);
  setSession({ name, email });
  return { name, email };
}

export function login(input: { email: string; password: string }) {
  const email = input.email.trim().toLowerCase();
  const password = input.password;

  if (!isValidEmail(email)) throw new Error("Please enter a valid email.");
  if (password.length < 6)
    throw new Error("Password must be at least 6 characters.");

  const user = getUsers().find((u) => u.email === email);
  if (!user || user.password !== password) {
    throw new Error("Invalid email or password.");
  }

  const session = { name: user.name, email: user.email };
  setSession(session);
  return session;
}

