/* eslint-disable import/no-anonymous-default-export */
const baseURL =
  process.env.NODE_ENV === "production"
    ? `${process.env.REACT_APP_API_BASE_URL}/api`
    : "http://localhost:5000/api";

export default {
  api: {
    hostURL:
      process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_API_BASE_URL
        : "http://localhost:5000",
    base: "/",
    baseURL,
    fileURL: "/file/",
    adminVersion: "1.0.1",
  },
};
