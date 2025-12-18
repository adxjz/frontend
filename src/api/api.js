const API_URL = "http://localhost:5000/api";

export const createOrder = async (products) => {
  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ products }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Order failed");
  }

  return res.json();
};
