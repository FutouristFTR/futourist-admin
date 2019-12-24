import axios from "axios";

const internalServer = axios.create({
  baseURL: process.env.REACT_APP_CLOUD_FUNCTIONS_URL,
});

export default internalServer;
