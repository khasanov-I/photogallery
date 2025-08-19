import axios from "axios";

export const __API__ = 'http://localhost:5000'

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || __API__,
});