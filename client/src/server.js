import axios from "axios";

const server = axios.create({
  baseURL: "http://localhost:3041",
});

export default server;
