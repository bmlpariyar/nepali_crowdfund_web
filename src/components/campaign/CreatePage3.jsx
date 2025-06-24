import React, { useState, useRef } from "react";
import { useCampaign } from "../../context/CampaignContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CreatePage3 = () => {
  const { campaignData, updateCampaign } = useCampaign();
  const [preview, setPreview] = useState(
    campaignData.cover_image ? URL.createObjectURL(campaignData.cover_image) : null
  );
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  const handleImageChange = (file) => {
    if (file && file.type.startsWith("image/")) {
      updateCampaign({ cover_image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleImageChange(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleImageChange(file);
  };

  const handleNext = () => {
    if (!campaignData.cover_image) {
      toast.error("Please upload a cover image.");
      return;
    }
    navigate("/create/campaign/step4");
  };

  return (
    <div className="min-h-screen flex bg-white text-gray-800">
      {/* Left Sidebar */}
      <div className="w-1/4 bg-gray-100 px-6  flex flex-col justify-center">
        <div className="pl-8">
          <h1 className="text-2xl font-semibold mb-3">Upload Cover Image</h1>
          <p className="text-gray-600 text-sm">
            Upload a photo that best represents your campaign.
          </p>
        </div>
      </div>

      {/* Right Content */}
      <div className="w-3/4 px-12 py-8 bg-white flex flex-col justify-between">
        <div className="max-w-4xl w-full mx-auto">
          <label className="block mb-4 text-lg font-semibold">
            Cover Image (JPEG/PNG)
          </label>

          <div
            className={` border-2 border-dashed h-96 rounded-xl p-10 text-center cursor-pointer transition-all flex flex-col justify-center ${isDragging ? "border-green-500 bg-green-50" : "border-gray-300 bg-gray-50"
              }`}
            onClick={() => fileInputRef.current.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              className="hidden"
            />
            <p className="text-gray-600">
              Drag & drop your image here or <span className="text-green-600 font-semibold">click to browse</span>
            </p>
            <p className="text-xs text-gray-400 mt-2">Accepted formats: JPEG, PNG</p>
          </div>

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-6 w-full h-[25rem] object-cover rounded-lg"
            />
          )}
        </div>

        {/* Footer */}
        <div className="mt-16">
          <hr className="border border-gray-300 mb-6" />
          <div className="flex justify-between items-center">
            <Link
              to="/create/campaign/step2"
              className={`bg-gray-600 hover:bg-gray-700 text-white font-medium px-6 py-2 rounded-lg transition`}
            >
              Back
            </Link>
            <button
              onClick={handleNext}
              className={`bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-lg transition`}
            >
              Continue
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CreatePage3;
