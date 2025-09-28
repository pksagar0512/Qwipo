import axios from "axios";

const API_URL = "http://localhost:5000/api/products";

export const addProduct = async (product, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const { data } = await axios.post(API_URL, product, config);
  return data;
};

export const getMyProducts = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const { data } = await axios.get(`${API_URL}/me`, config);
  return data;
};
