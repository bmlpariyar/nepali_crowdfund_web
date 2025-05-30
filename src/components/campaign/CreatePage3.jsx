import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Image, Link as LinkIcon } from "lucide-react";
import { useCampaign } from "../../context/CampaignContext";

const CreatePage3 = () => {
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [videoLink, setVideoLink] = useState("");
  const { campaignData, updateCampaign } = useCampaign();

  useEffect(() => {
    if (campaignData.image_url) setCoverPhoto(campaignData.image_url);
    if (campaignData.video_url) setVideoLink(campaignData.video_url);
  }, [campaignData]);

  return (
    <div className="min-h-screen flex bg-white text-gray-800">
      {/* Left Sidebar */}
      <div className="w-1/4 bg-gray-100 px-6 py-24 flex flex-col justify-center">
        <div>
          <h1 className="text-2xl font-semibold mb-3">
            Add Cover Photo or Video
          </h1>
          <p className="text-gray-600 text-sm">
            A compelling cover photo or video can significantly improve the
            chances of your campaign's success. Choose something that best
            represents your cause.
          </p>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="w-3/4 px-12 py-24 flex flex-col justify-between bg-white">
        <div className="max-w-xl w-full mx-auto">
          {/* Drag & Drop File Upload */}
          <div className="mb-8">
            <label htmlFor="coverPhotoUpload">
              <div className="w-full h-80 border-2 border-dashed border-gray-400 rounded-lg flex flex-col justify-center items-center cursor-pointer hover:border-green-500 transition">
                <Image className="w-10 h-10 text-gray-400 mb-2" />
                <p className="text-gray-600 text-sm font-medium">
                  Drag or upload your photo here
                </p>
                {coverPhoto && (
                  <p className="mt-1 text-green-700 text-sm">
                    Selected: {coverPhoto.name}
                  </p>
                )}
              </div>
            </label>
            <input
              id="coverPhotoUpload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setCoverPhoto(e.target.files[0])}
            />
          </div>

          {/* OR Separator */}
          <div className="flex items-center gap-4 mb-6">
            <hr className="flex-grow border-gray-300" />
            <span className="text-gray-500 text-sm">OR</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Video Link Input */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Paste video link (YouTube, Vimeo...)"
              className="border border-gray-300 focus:ring-2 focus:ring-green-500 p-3 pl-10 rounded-lg w-full text-base"
              value={videoLink}
              onChange={(e) => {
                const value = e.target.value;
                setVideoLink(value);
                updateCampaign({ video_url: value });
              }}
            />
            <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* Footer Section */}
        <div className="mt-16">
          <hr className="border border-gray-300 mb-6" />
          <div className="flex justify-between items-center">
            <Link
              to="/create/campaign/step2"
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition font-medium"
            >
              Back
            </Link>
            <Link
              to="/create/campaign/step4"
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-medium"
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
