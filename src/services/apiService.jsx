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
export const fetchCampaigns = (page) => apiClient.get("/campaigns", { params: { page } });
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
  if (campaignData.latitude)
    formData.append("campaign[latitude]", campaignData.latitude);
  if (campaignData.longitude)
    formData.append("campaign[longitude]", campaignData.longitude);

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

  if (profileDataWithFile.latitude !== undefined)
    formData.append(
      "user_profile[latitude]",
      profileDataWithFile.latitude
    );

  if (profileDataWithFile.longitude !== undefined)
    formData.append(
      "user_profile[longitude]",
      profileDataWithFile.longitude
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

// ==================Featured Campaigns=====================
export const fetchFeaturedCampaigns = () => {
  return apiClient.get("/featured_campaigns");
};

// ======================Search===========================
export const fetchSearchedCampaigns = async (searchParams) => {
  try {
    const params = new URLSearchParams();

    if (searchParams.name) params.append('name', searchParams.name);
    if (searchParams.status) params.append('status', searchParams.status);
    if (searchParams.category) params.append('category', searchParams.category);
    if (searchParams.sort_by) params.append('sort_by', searchParams.sort_by);
    if (searchParams.min_goal) params.append('min_goal', searchParams.min_goal);
    if (searchParams.max_goal) params.append('max_goal', searchParams.max_goal);
    if (searchParams.page) params.append('page', searchParams.page);
    if (searchParams.per_page) params.append('per_page', searchParams.per_page);

    const response = await apiClient.get(`/search?${params.toString()}`);

    // If you're using axios (which it looks like), response is always 2xx or throws
    const data = response.data;

    return {
      data: data.campaigns,
      pagination: data.pagination
    };
  } catch (error) {
    console.error('Search campaigns error:', error);
    throw error;
  }
};


// ================CampaignViers==============
export const logCampaignView = (campaignId) => {
  return apiClient.post(`/campaigns/${campaignId}/view`);
}

// ===============Recommendations==============
export const fetchRecommendations = () => apiClient.get('/recommendations/index');

// ==============Location==============
export const fetchLocation = (lat, lng) => {
  return axios.get('https://nominatim.openstreetmap.org/reverse', {
    params: {
      format: 'json',
      lat: lat,
      lon: lng,
    },
    headers: {
      'User-Agent': 'sahayog/1.0 (leopariyar8@gmail.com)',
      'Accept-Language': 'en',
    },
  });
};


// ====================Admin Service=============
export const adminFetchUsers = () => { return apiClient.get('/admin/users/'); };
export const getUserCountDetails = () => {
  return apiClient.get('/api/v1/dashboard/user_count_details');
}

export const getWeeklyCampaignActivities = () => {
  return apiClient.get('/api/v1/dashboard/get_weekly_campaign_activities');
}
export const getCategoryCampaignDetails = () => {
  return apiClient.get('/api/v1/dashboard/get_category_campaign_details');
}

export const getRecentCampaigns = () => {
  return apiClient.get('/api/v1/dashboard/get_recent_campaigns');
}


// ====================aiService=============
export const analyzeStory = (text) => {
  return apiClient.post('/ai_assistant/analyze', { text });
};


// ====================chat message==================
export const fetchChatMessages = (campaignId) => {
  return apiClient.get(`/api/v1/campaigns/${campaignId}/chat_messages`);

}

export const postChatMessage = (campaignId, message) => {
  return apiClient.post(`/api/v1/campaigns/${campaignId}/chat_messages`, { chat_message: message });
};

export const markMessagesAsRead = (campaignId) => {
  return apiClient.post(`/api/v1/campaigns/${campaignId}/chat_messages/mark_as_read`);
};
