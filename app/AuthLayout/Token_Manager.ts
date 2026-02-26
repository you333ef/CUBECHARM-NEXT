import axios from "axios";

let accessToken: string | null = null;
let refreshInFlight: Promise<string | null> | null = null;

const refreshApi = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

export const getToken = () => accessToken;

export const setToken = (token: string | null) => {
  accessToken = token;
};

export const refreshToken = async (): Promise<string | null> => {
  if (!refreshInFlight) {
    refreshInFlight = refreshApi
      .post("/Auth/refresh-token")
      .then((res) => {
        const token = res.data.accessToken;

        setToken(token);
        return token;
      })
      .catch(() => {
        setToken(null);
        return null;
      })
      .finally(() => {
        refreshInFlight = null;
      });
  }

  return refreshInFlight;
};