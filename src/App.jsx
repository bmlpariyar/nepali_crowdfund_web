
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CampaignListPage from './components/CampaignListPage';
import CampaignDetailPage from './components/CampaignDetailPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Navbar from './components/Navbar';
import CreateCampaignPage from './components/CreateCampaignPage';
import UpdateCampaignPage from './components/UpdateCampaignPage';
import ProtectedRoute from './components/ProtectedRoute';
import ProfileSetupStep1Page from './components/ProfileSetupStep1Page';
function App() {
  return (
    <div>
      <Navbar />

      <div style={{ padding: '15px' }}>
        <Routes>
          <Route path="/" element={<CampaignListPage />} />
          <Route path="/campaigns" element={<CampaignListPage />} />
          <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/create-campaign"
            element={
              <ProtectedRoute>
                <CreateCampaignPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/update-campaign/:id"
            element={
              <ProtectedRoute>
                <UpdateCampaignPage />
              </ProtectedRoute>
            }
          />

          <Route path="/setup-profile/step1" element={
            <ProtectedRoute><ProfileSetupStep1Page /></ProtectedRoute>
          } />
        </Routes>

      </div>
    </div>
  );
}

export default App;