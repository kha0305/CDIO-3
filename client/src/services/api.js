const isLocal =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (isLocal ? "http://localhost:5000/api" : "/api");

// Books API
export const booksApi = {
  getAll: () => fetch(`${API_BASE_URL}/books`).then((res) => res.json()),
  create: (data) =>
    fetch(`${API_BASE_URL}/books`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((res) => res.json()),
  update: (id, data) =>
    fetch(`${API_BASE_URL}/books/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((res) => res.json()),
  delete: (id) => fetch(`${API_BASE_URL}/books/${id}`, { method: "DELETE" }),
};

// Readers API
export const readersApi = {
  getAll: () => fetch(`${API_BASE_URL}/readers`).then((res) => res.json()),
  create: (data) =>
    fetch(`${API_BASE_URL}/readers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((res) => res.json()),
  update: (id, data) =>
    fetch(`${API_BASE_URL}/readers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((res) => res.json()),
  delete: (id) => fetch(`${API_BASE_URL}/readers/${id}`, { method: "DELETE" }),
};

// Transactions API
export const transactionsApi = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetch(`${API_BASE_URL}/transactions?${queryString}`).then((res) =>
      res.json(),
    );
  },
  borrow: (data) =>
    fetch(`${API_BASE_URL}/borrow`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((res) => res.json()),
  return: (transactionId) =>
    fetch(`${API_BASE_URL}/return`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transactionId }),
    }).then((res) => res.json()),
  extend: (transactionId, newDueDate) =>
    fetch(`${API_BASE_URL}/extend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transactionId, newDueDate }),
    }).then((res) => res.json()),
};

// Reservations API
export const reservationsApi = {
  getAll: () => fetch(`${API_BASE_URL}/reservations`).then((res) => res.json()),
  create: (data) =>
    fetch(`${API_BASE_URL}/reservations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  cancel: (id) =>
    fetch(`${API_BASE_URL}/reservations/${id}/cancel`, { method: "PUT" }),
  approve: (id) =>
    fetch(`${API_BASE_URL}/reservations/${id}/approve`, { method: "PUT" }),
};

// Fines API
export const finesApi = {
  getAll: (filter = "all") => {
    let url = `${API_BASE_URL}/fines`;
    if (filter !== "all") {
      url += `?paid=${filter === "paid"}`;
    }
    return fetch(url).then((res) => res.json());
  },
  pay: (id) => fetch(`${API_BASE_URL}/fines/${id}/pay`, { method: "PUT" }),
};

// Stats API
export const statsApi = {
  get: () => fetch(`${API_BASE_URL}/stats`).then((res) => res.json()),
};

// Notifications API
export const notificationsApi = {
  getAll: () =>
    fetch(`${API_BASE_URL}/notifications`).then((res) => res.json()),
  markRead: (id) =>
    fetch(`${API_BASE_URL}/notifications/${id}/read`, { method: "PUT" }).then(
      (res) => res.json(),
    ),
  markAllRead: () =>
    fetch(`${API_BASE_URL}/notifications/read-all`, { method: "POST" }).then(
      (res) => res.json(),
    ),
};

// Auth API
export const authApi = {
  login: (data) =>
    fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((res) => res.json()),
  register: (data) =>
    fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((res) => res.json()),
};
