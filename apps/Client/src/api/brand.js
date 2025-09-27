import axios from "axios";

export const fetchBrandsByCategory = async (category) => {
  const res = await axios.get(`/api/brands?category=${category}`);
  return res.data;
};