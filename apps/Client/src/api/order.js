import axios from "axios";

export const placeOrder = async (orderData) => {
  const res = await axios.post("/api/orders", orderData);
  return res.data;
};