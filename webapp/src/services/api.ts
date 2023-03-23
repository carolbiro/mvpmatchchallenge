import jwt_decode from "jwt-decode";

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiError";
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export const fetchWithAuth = async (input: RequestInfo, init: RequestInit) => {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  init = {...init, headers: { ...init?.headers, 'Content-Type': 'application/json'}};

  if (accessToken) {
    // Check if the access token has expired
    const decodedAccessToken: any = jwt_decode(accessToken);
    const currentTime = Date.now() / 1000;
    if (decodedAccessToken.exp < currentTime) {
      // Access token has expired, try to refresh it
      try {
        const response = await fetch(`/auth/refreshTokens`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        });
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("accessToken", data.accessToken);
          // Retry the original request with the new access token
          const authHeaders = { Authorization: `Bearer ${data.accessToken}` };
          const newInit = { ...init, headers: { ...init?.headers, ...authHeaders } };
          return fetch(input, newInit);
        } else {
          // Refresh token has expired, log the user out
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.reload();
        }
      } catch (error) {
        // Handle errors when refreshing token
        throw error;
      }
    } else {
      // Access token is still valid, add it to the request headers
      const authHeaders = { Authorization: `Bearer ${accessToken}` };
      const newInit = { ...init, headers: { ...init?.headers, ...authHeaders } };
      return fetch(input, newInit);
    }
  }

  // No access token found, do nothing
  return fetch(input, init);
};
