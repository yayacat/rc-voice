import { apiService, base64encode } from "./api.service";

export const authService = {
  login: async (credentials) => {
    const loginData = {
      ...credentials,
      password: base64encode(credentials.password),
    };
    return apiService.post("/login", loginData);
  },

  register: async (userData) => {
    const registerData = {
      ...userData,
      password: base64encode(userData.password),
    };
    return apiService.post("/register", registerData);
  },
};

export default authService;
