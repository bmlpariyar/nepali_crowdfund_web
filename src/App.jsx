import React from "react";
import { Routes, Route } from "react-router-dom";
import CampaignListPage from "./components/CampaignListPage";
import CampaignDetailPage from "./components/CampaignDetailPage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import Navbar from "./components/Navbar";
import CreateCampaignPage from "./components/CreateCampaignPage";
import UpdateCampaignPage from "./components/UpdateCampaignPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfileSetupStep1Page from "./components/ProfileSetupStep1Page";
import UserProfilePage from "./components/UserProfilePage";
import EditUserProfilePage from "./components/EditUserProfilePage";
import CreatePage1 from "./components/campaign/CreatePage1";
import CreatePage2 from "./components/campaign/CreatePage2";
import CreatePage3 from "./components/campaign/CreatePage3";
import CreatePage4 from "./components/campaign/CreatePage4";
import PreviewPage from "./components/campaign/PreviewPage";
import LandingPage from "./components/landing_page/LandingPage";
import SearchMain from "./components/search/SearchMain";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'leaflet/dist/leaflet.css';

import LocationHandler from "./components/LocationHandler";

function App() {
  return (
    <div>
      <Navbar />
      <LocationHandler />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen ">
        <Routes>
          <Route path="/" element={<LandingPage />} />
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

          <Route
            path="/setup-profile/step1"
            element={
              <ProtectedRoute>
                <ProfileSetupStep1Page />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile/edit"
            element={
              <ProtectedRoute>
                <EditUserProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create/campaign/step1"
            element={
              <ProtectedRoute>
                <CreatePage1 />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create/campaign/step2"
            element={
              <ProtectedRoute>
                <CreatePage2 />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create/campaign/step3"
            element={
              <ProtectedRoute>
                <CreatePage3 />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create/campaign/step4"
            element={
              <ProtectedRoute>
                <CreatePage4 />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create/campaign/preview"
            element={
              <ProtectedRoute>
                <PreviewPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/main"
            element={
              <LandingPage />
            }
          />

          <Route
            path="/search"
            element={
              <SearchMain />
            }
          />

          {/* ======================================================================== */}
        </Routes>
      </div>
    </div>
  );
}

export default App;
