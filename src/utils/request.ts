import axios from "axios";

const isProd = process.env.NODE_ENV === "production";
const baseUrl = isProd ? "" : "";

axios.defaults.baseURL = baseUrl;
axios.defaults.timeout = 20000;
axios.defaults.withCredentials = true;
axios.defaults.responseType = "json";

const fetch = axios.create({
  headers: {
    "Content-Type": "application/json"
  }
});
fetch.interceptors.response.use(
  function(response) {
    return response.data;
  },
  function(error) {
    console.error(error);
    return error;
  }
);

export default fetch;
