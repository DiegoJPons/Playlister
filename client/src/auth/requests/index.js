import axios from "axios";
axios.defaults.withCredentials = true;
const api = axios.create({
  baseURL: "http://localhost:4000/auth",
});

export const getLoggedIn = () => api.get(`/loggedIn/`);
export const loginUser = (email, password) => {
  return api.post(`/login/`, {
    email: email,
    password: password,
  });
};
export const logoutUser = () => api.get(`/logout/`);
export const registerUser = (
  userName,
  email,
  password,
  passwordVerify,
  avatarUrl
) => {
  return api.post(`/register/`, {
    userName: userName,
    email: email,
    password: password,
    passwordVerify: passwordVerify,
    avatarUrl: avatarUrl,
  });
};

export const updateUser = (userName, password, passwordVerify, avatarUrl) => {
  return api.put(`/updateUser/`, {
    userName: userName,
    password: password,
    passwordVerify: passwordVerify,
    avatarUrl: avatarUrl,
  });
};

export const loginGuest = () => {
  return api.get(`/guestLogin/`);
};
const apis = {
  getLoggedIn,
  registerUser,
  loginUser,
  logoutUser,
  updateUser,
  loginGuest,
};

export default apis;
