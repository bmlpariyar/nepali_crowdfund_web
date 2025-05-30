// src/services/apiService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const getAuthToken = () => {
    return localStorage.getItem('jwtToken');
};

// Request Interceptor: Adds the token to requests if available
apiClient.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token) {
            // Add Authorization header, skip for login/register paths
            if (!config.url.endsWith('/login') && !config.url.endsWith('/users')) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// --- Campaign Functions ---
export const fetchCampaigns = () => apiClient.get('/campaigns');
// Use ID instead of Slug
export const fetchCampaignById = (id) => apiClient.get(`/campaigns/${id}`);
export const fetchCategories = () => apiClient.get('/categories');


// --- Auth Functions ---
export const loginUser = (credentials) => {
    // Ensure data is nested correctly for Rails controller (e.g., under 'session')
    return apiClient.post('/login', { session: credentials });
};

export const registerUser = (userData) => {
    // Ensure data is nested correctly for Rails controller (e.g., under 'user')
    return apiClient.post('/users', { user: userData });
};

export const fetchUserProfile = () => {
    // Requires authentication, token added by interceptor
    return apiClient.get('/me');
};

// --- Authenticated Campaign Creation ---
export const createCampaign = (campaignData) => {

    return apiClient.post('/campaigns', { campaign: campaignData });
};

export const deleteCampaignById = (id) => {
    return apiClient.delete(`/campaigns/${id}`);
};

export const updateCampaignById = (id, campaignData) => {
    return apiClient.patch(`/campaigns/${id}`, { campaign: campaignData });
}

export const makeDonation = (campaignId, donationData) => {
    return apiClient.post(`/campaigns/${campaignId}/donations`, { donation: donationData });
}
export const updateMyProfile = (profileDataWithFile) => {
    const formData = new FormData();

    if (profileDataWithFile.bio !== undefined) formData.append('user_profile[bio]', profileDataWithFile.bio);
    if (profileDataWithFile.location !== undefined) formData.append('user_profile[location]', profileDataWithFile.location);
    if (profileDataWithFile.website_url !== undefined) formData.append('user_profile[website_url]', profileDataWithFile.website_url);
    if (profileDataWithFile.date_of_birth !== undefined) formData.append('user_profile[date_of_birth]', profileDataWithFile.date_of_birth);
    if (profileDataWithFile.profile_image) {
        formData.append('user_profile[profile_image]', profileDataWithFile.profile_image);
    }

    return apiClient.put('/profile', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
};