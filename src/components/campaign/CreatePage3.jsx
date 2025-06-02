import React, { useState } from "react";
import { useCampaign } from "../../context/CampaignContext";
import { Link } from "react-router-dom";

const CreatePage3 = () => {
  const { campaignData, updateCampaign } = useCampaign();
  const [preview, setPreview] = useState(
    campaignData.cover_image ? URL.createObjectURL(campaignData.cover_image) : null
  );

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      updateCampaign({ cover_image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen flex bg-white text-gray-800">
      {/* Left Sidebar */}
      <div className="w-1/4 bg-gray-100 px-6 py-24 flex flex-col justify-center">
        <h1 className="text-2xl font-semibold mb-3">Upload Cover Image</h1>
        <p className="text-gray-600 text-sm">
          Upload a photo that best represents your campaign.
        </p>
      </div>

      {/* Right Content */}
      <div className="w-3/4 px-12 py-24">
        <div className="max-w-xl mx-auto">
          <label className="block mb-4 text-lg font-semibold">
            Cover Image (JPEG/PNG)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:bg-white file:text-sm file:font-semibold file:text-gray-700 hover:file:bg-gray-100"
          />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-6 w-full h-64 object-cover rounded-lg"
            />
          )}
        </div>

        {/* Footer */}
        <div className="mt-16">
          <hr className="border border-gray-300 mb-6" />
          <div className="flex justify-end">
            <Link
              to="/create/campaign/step4"
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Continue
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePage3;
