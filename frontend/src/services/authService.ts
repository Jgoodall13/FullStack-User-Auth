import axios from "axios";

const API_BASE = "http://localhost:3000/api/v1";

export const loginUser = async (
  email: string,
  password: string
): Promise<string> => {
  const response = await axios.post(`${API_BASE}/users/login`, {
    email,
    password,
  });
  console.log("Sending payload:", { email, password });
  return response.data.token; // Assuming the backend returns a token
};

export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<void> => {
  await axios.post(`${API_BASE}/users/register`, { name, email, password });
};
