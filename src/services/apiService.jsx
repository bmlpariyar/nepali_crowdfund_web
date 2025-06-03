// src/services/apiService.js
import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const getAuthToken = () => {
  return localStorage.getItem("jwtToken");
};

// Request Interceptor: Adds the token to requests if available
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      // Add Authorization header, skip for login/register paths
      if (!config.url.endsWith("/login") && !config.url.endsWith("/users")) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Campaign Functions ---
export const fetchCampaigns = () => apiClient.get("/campaigns");
// Use ID instead of Slug
export const fetchCampaignById = (id) => apiClient.get(`/campaigns/${id}`);
export const fetchCategories = () => apiClient.get("/categories");

// --- Auth Functions ---
export const loginUser = (credentials) => {
  // Ensure data is nested correctly for Rails controller (e.g., under 'session')
  return apiClient.post("/login", { session: credentials });
};

export const registerUser = (userData) => {
  // Ensure data is nested correctly for Rails controller (e.g., under 'user')
  return apiClient.post("/users", { user: userData });
};

export const fetchUserProfile = () => {
  // Requires authentication, token added by interceptor
  return apiClient.get("/me");
};

export const getSupportMessages = (campaignId) => {
  return apiClient.get(`/campaigns/${campaignId}/support_messages`);
}

export const getCampaignUpdateMessages = (campaignId) => {
  return apiClient.get(`/campaigns/${campaignId}/get_update_messages`);
}

export const postUpdateMessages = (campaignId, data) => {
  const formData = new FormData();
  formData.append('update_message[title]', data.title);
  formData.append('update_message[message]', data.message);
  if (data.media_image) {
    formData.append('update_message[media_image]', data.media_image);
  }

  return apiClient.post(`/campaigns/${campaignId}/update_messages`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};


// --- Authenticated Campaign Creation ---
export const createCampaign = (campaignData) => {
  const formData = new FormData();
  if (campaignData.title)
    formData.append("campaign[title]", campaignData.title);
  if (campaignData.story)
    formData.append("campaign[story]", campaignData.story);
  if (campaignData.funding_goal)
    formData.append("campaign[funding_goal]", campaignData.funding_goal);
  if (campaignData.category_id)
    formData.append("campaign[category_id]", campaignData.category_id);
  if (campaignData.deadline)
    formData.append("campaign[deadline]", campaignData.deadline);
  if (campaignData.cover_image)
    formData.append("campaign[cover_image]", campaignData.cover_image);
  if (campaignData.video_url)
    formData.append("campaign[video_url]", campaignData.video_url);
  if (campaignData.country)
    formData.append("campaign[country]", campaignData.country);

  return apiClient.post("/campaigns", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateCampaignById = (id, data) => {
  return apiClient.put(`/campaigns/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};



export const deleteCampaignById = (id) => {
  return apiClient.delete(`/campaigns/${id}`);
};


export const makeDonation = (campaignId, donationData) => {
  return apiClient.post(`/campaigns/${campaignId}/donations`, {
    donation: donationData,
  });
};
export const updateMyProfile = (profileDataWithFile) => {
  const formData = new FormData();

  if (profileDataWithFile.bio !== undefined)
    formData.append("user_profile[bio]", profileDataWithFile.bio);
  if (profileDataWithFile.location !== undefined)
    formData.append("user_profile[location]", profileDataWithFile.location);
  if (profileDataWithFile.website_url !== undefined)
    formData.append(
      "user_profile[website_url]",
      profileDataWithFile.website_url
    );
  if (profileDataWithFile.date_of_birth !== undefined)
    formData.append(
      "user_profile[date_of_birth]",
      profileDataWithFile.date_of_birth
    );
  if (profileDataWithFile.profile_image) {
    formData.append(
      "user_profile[profile_image]",
      profileDataWithFile.profile_image
    );
  }

  return apiClient.put("/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// =================Donations=====================
export const getAllDonations = (campaignId) => {
  return apiClient.get(`/campaigns/${campaignId}/all_donations`);
};
export const getTopDonations = (campaignId) => {
  return apiClient.get(`/campaigns/${campaignId}/top_donations`);
};
export const donation_highlight = (campaignId) => {
  return apiClient.get(`/campaigns/${campaignId}/donation_highlight`);
};


