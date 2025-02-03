export const API_URL = "http://localhost:4500";

// Utility functions
export const base64encode = (str) => {
  try {
    return btoa(str);
  } catch (e) {
    return str;
  }
};

// Error handling utility
const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    // Handle specific error codes
    if (response.status === 409) {
      throw new Error(data.error || "資源已存在");
    }
    throw new Error(data.error || "請求失敗");
  }

  return data;
};

// Base API service
export const apiService = {
  // GET request
  get: async (endpoint) => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`);
      return handleResponse(response);
    } catch (error) {
      throw new Error(error.message || "獲取資料失敗");
    }
  },

  // POST request
  post: async (endpoint, data) => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    } catch (error) {
      throw new Error(error.message || "提交資料失敗");
    }
  },

  // PATCH request
  patch: async (endpoint, data) => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    } catch (error) {
      throw new Error(error.message || "更新資料失敗");
    }
  },

  // Upload file
  upload: async (endpoint, file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        body: formData,
      });
      return handleResponse(response);
    } catch (error) {
      throw new Error(error.message || "上傳檔案失敗");
    }
  },
};
