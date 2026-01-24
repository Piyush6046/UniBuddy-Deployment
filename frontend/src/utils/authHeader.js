// src/utils/authHeader.js

/**
 * Returns consistent auth configuration for Axios requests.
 * Safely handles missing or invalid tokens to prevent backend 401 errors 
 * on public-friendly routes.
 */
export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  const config = {
    withCredentials: true,
    headers: {},
  };

  // Only attach Authorization header if a potentially valid token exists
  if (token && token !== "null" && token !== "undefined" && token.length > 10) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

/*
 * Note on 'Bearer':
 * It's an HTTP authentication scheme. The 'Bearer' (holder) of this token
 * is granted access to protected resources.
 */